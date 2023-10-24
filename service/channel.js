import get from "lodash/get";
import has from "lodash/has";
import Pusher from "pusher-js/react-native";
import EventEmitter from "./eventEmitter";
import JelouApiV1 from "../api/JelouApiV1";
import { messageCounter } from "./messageCounter";
import { parseRoom } from "../utils/helpers";
import { getRoom } from "../api/entities/rooms";

const REACT_APP_PUSHER_KEY = process.env.REACT_APP_PUSHER_KEY || "519345aac33f4a10ccf8";
const REACT_APP_PUSHER_CLUSTER = process.env.REACT_APP_PUSHER_KEY || "us2";

class Channel extends EventEmitter {
    /**
     * @param {string} credentials.providerId
     */
    constructor({ companyId, providerId, companySocketId, credentials }) {
        super();

        this.pusher = new Pusher(REACT_APP_PUSHER_KEY, {
            cluster: REACT_APP_PUSHER_CLUSTER,
        });

        this.pusher.connection.bind("state_change", (states) => {
            // this is when the connection of pusher changes
            this.emit("stateChange", states);
        });
        // get rooms from redux store

        const { companyChannel, personalChannel } = this.initPusherSubscriptions({ companyId, providerId, companySocketId });
        this.companyChannel = companyChannel;
        this.personalChannel = personalChannel;
        this.bindInitEvents({ companyId, providerId, companySocketId, credentials });
    }

    initPusherSubscriptions({ providerId, companySocketId } = {}) {
        const companyChannel = this.pusher.subscribe(`channel-company-${companySocketId}`);

        const personalChannel = this.pusher.subscribe(`socket-${providerId}`);

        return { companyChannel, personalChannel };
    }

    bindInitEvents({ providerId, companySocketId, credentials } = {}) {
        this.bindToMessages({ credentials });
        this.bindToChatEvents({ providerId, companySocketId });
        this.bindQueueEvents();
        this.bindToCompanyChannel({ providerId });
    }

    bindToCompanyChannel({ providerId } = {}) {
        this.companyChannel.bind("operator-assign", (operator) => {
            this.emit("operatorAssign", operator);
        });

        this.companyChannel.bind("operator-status-update", (operator) => {
            console.log("operator-status-update", operator);
            operator?.providerId === providerId && this.emit("operatorStatusUpdate", operator);
        });
    }

    bindToMessages({ credentials } = {}) {
        this.companyChannel.bind("message_update", (message) => {
            console.log("message_update ===", message);
            this.emit("ackMessage", {
                ...message,
                sender: credentials,
                ...(message.createdAt ? { createdAt: message.createdAt * 1000 } : {}),
            });
        });
        // messagesChannel.bind("support-tickets-reply-update", (message) => {
        //     this.emit("ackMessage", {
        //         ...message,
        //         ...(message.createdAt ? { createdAt: message.createdAt * 1000 } : {}),
        //     });
        // });
    }

    bindToChatEvents({ providerId } = {}) {
        this.personalChannel.bind("room-member-add", async (data) => {
            const { payload } = data;
            // console.log("room-member-add event data", payload);

            if (get(payload, "memberUpdated.providerId", get(payload, "memberUpdated.id", "")) === providerId) {
                const { roomId } = payload;
                const response = await getRoom({ roomId });
                const isNewMemberDataInfo = get(response, `membersMetaInfo[${providerId}].isNew`, false);
                let roomWithFinalData = {};
                if (has(response, "membersMetaInfo")) {
                    roomWithFinalData = {
                        ...response,
                        membersMetaInfo: {
                            ...response.membersMetaInfo,
                            [providerId]: {
                                ...response.membersMetaInfo[providerId],
                                isNew: isNewMemberDataInfo,
                            },
                        },
                    };
                } else {
                    roomWithFinalData = {
                        ...response,
                    };
                }

                this.emit("addedToRoom", roomWithFinalData);
            }
        });

        this.personalChannel.bind("room-member-remove", (data) => {
            const { payload } = data;
            if (get(payload, "memberUpdated.providerId", get(payload, "memberUpdated.id", "")) === providerId) {
                this.emit("removedFromRoom", payload);
            }
        });

        this.personalChannel.bind("room-message", async (data) => {
            const { payload } = data;
            const { message, messageId, by, createdAt, room, sender, status } = payload;
            const { id: senderId, botId: appId } = sender;
            const { id: roomId } = room;
            const parsedMessage = {
                _id: messageId,
                recipientId: senderId,
                senderId,
                sender,
                by,
                roomId,
                messageId,
                status,
                createdAt: createdAt * 1000,
                message,
                id: messageId,
                userId: senderId,
                appId,
            };

            console.log("room-message", parsedMessage);
            this.emit("message", parsedMessage);
        });

        this.personalChannel.bind("room-message-update", (data) => {
            const { payload } = data;
            console.log("room-message-update", this.credentials);
            const message = {
                ...payload,
                sender: { ...this.credentials },
                id: payload.messageId,
                roomId: payload.room.id,
            };

            this.emit("ackMessage", message);
        });

        this.personalChannel.bind("client-metadata-update", (data) => {
            const { _id } = data;

            JelouApiV1.get(`/real-time-events/${_id}`).then(({ data: response }) => {
                const { data } = response;
                const { metadata } = data.payload;
                Store.dispatch(saveData(metadata));
            });
        });

        // Email channels
        this.companyChannel.bind("support-tickets-assign", (data) => {
            const mailInfo = { ...get(data, "supportTicket"), user: get(data, "User"), bot: get(data, "Bot") };
            this.emit("assignMail", mailInfo);
        });
        this.personalChannel.bind("support-tickets-reply-new", (data) => {
            const payload = get(data, "payload");
            this.emit("replyNewMail", payload);
        });

        // messageChannel.bind("operator-time-first-response", (data) => {
        //     const { avgReplyTime } = data;
        //     Store.dispatch(updateOperatorAvgResponseTime(avgReplyTime));
        // });
    }

    bindQueueEvents() {
        this.companyChannel.bind("new_ticket", (data) => {
            console.log("new_ticket", JSON.stringify(data, null, 2));
            this.emit("newQueue", data);
        });

        this.companyChannel.bind("update_ticket", (data) => {
            console.log("update_ticket", JSON.stringify(data, null, 2));
            this.emit("updateQueue", data);
        });

        this.companyChannel.bind("take_ticket_response", (data) => {
            this.emit("takeQueueResponse", data);
        });
    }

    bindEmailsEvents() {
        this.companyChannel.bind("support-tickets-assign", (data) => {
            const mailInfo = { ...get(data, "supportTicket"), user: get(data, "User"), bot: get(data, "Bot") };
            this.emit("assignMail", mailInfo);
        });
        this.companyChannel.bind("support-tickets-update", (data) => {
            this.emit("updateEmail", data);
        });
        this.personalChannel.bind("support-tickets-reply-new", (data) => {
            const payload = get(data, "payload");
            this.emit("replyNewMail", payload);
        });
        this.companyChannel.bind("support-tickets-reply-update", (data) => {
            const message = {
                ...data,
                ...(data.createdAt ? { createdAt: data.createdAt * 1000 } : {}),
            };
            this.emit("supportTicketsReplyUpdate", message);
        });
    }

    unbindToCompanyChannel() {
        this.companyChannel.unbind("operator-assign");
        this.companyChannel.unbind("operator-status-update");
    }

    unbindToMessages() {
        this.companyChannel.unbind("message_update");
        this.companyChannel.unbind("support-tickets-reply-update");
    }

    unbindToChatEvents() {
        this.personalChannel.unbind("room-member-add");
        this.personalChannel.unbind("room-member-remove");
        this.personalChannel.unbind("room-message");
        this.personalChannel.unbind("room-message-update");
        this.personalChannel.unbind("client-metadata-update");
        this.companyChannel.unbind("support-tickets-assign");
        this.personalChannel.unbind("support-tickets-reply-new");
        this.personalChannel.unbind("operator-time-first-response");
    }

    unbindQueueEvents() {
        this.companyChannel.unbind("new_ticket");
        this.companyChannel.unbind("update_ticket");
        this.companyChannel.unbind("take_ticket_response");
    }

    unbindEmailsEvents() {
        this.companyChannel.unbind("support-tickets-assign");
        this.personalChannel.unbind("support-tickets-reply-new");
        this.companyChannel.unbind("support-tickets-reply-update");
    }

    unsubscribeFromChatEvents(providerId) {
        const messageChannelName = `socket-${providerId}`;
        this.pusher.unsubscribe(messageChannelName);
    }

    unsubscribeFromMessages(companySocketId) {
        const companyChannel = `channel-company-${companySocketId}`;
        this.pusher.unsubscribe(companyChannel);
    }

    unsubscribeFromQueues(companySocketId) {
        const companyChannel = `channel-company-${companySocketId}`;
        this.pusher.unsubscribe(companyChannel);
    }
}

export default Channel;
