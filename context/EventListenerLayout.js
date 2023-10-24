import { View, Text } from "react-native";
import React, { useContext, useEffect, useRef } from "react";
import PmaManagerContext from "./PmaManagerContext";
import { useQueryClient } from "@tanstack/react-query";

import { ackMessage, addMessage, updateMessage } from "../reducers/messages";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { useDispatch, useSelector } from "react-redux";
import { ROOM_TYPES } from "../constants/constants";
import JelouApiV1 from "../api/JelouApiV1";
import { addQueue, deleteQueue, updateQueue } from "../reducers/queues";
import { mergeById, parseRoom } from "../utils/helpers";
import { updateUserSession } from "../reducers/userSession";
import { deleteSidebarChanged } from "../reducers/sidebarChanged";
import { deleteVerifyStatus } from "../reducers/verifyStatus";

const EventListenerLayout = (props) => {
    const dispatch = useDispatch();
    const pmaService = useContext(PmaManagerContext);
    const userSession = useSelector((state) => state.userSession);
    const messages = useSelector((state) => state.messages);

    const currentMessages = useRef(null);
    currentMessages.current = messages;
    const currentUserSession = useRef(null);
    currentUserSession.current = userSession;

    useEffect(() => {
        if (pmaService) {
            subscribeToEvents(pmaService);
        }
    }, [pmaService]);

    const subscribeToEvents = (pmaService) => {
        pmaService.onEvent("message", (payload) => onMessage(payload));
        pmaService.onEvent("ackMessage", (payload) => onAckMessage(payload));
        pmaService.onEvent("addedToRoom", (payload) => {
            onAddedToRoom(payload);
        });
        pmaService.onEvent("removedFromRoom", (payload) => {
            console.log("removedFromRoom", payload);
            onRemovedFromRoom(payload);
        });
        pmaService.onEvent("stateChange", (payload) => onStateChange(payload));
        // Email
        // pmaService.onEvent("assignMail", (payload) => onAssignMail(payload));
        // pmaService.onEvent("updateEmail", (payload) => onUpdateEmail(payload));

        // pmaService.onEvent("replyNewMail", (payload) => onReplyNewMail(payload));
        // pmaService.onEvent("emailsReplyUpdate", (payload) => onEmailsReplyUpdate(payload));
        pmaService.onEvent("supportTicketsReplyUpdate", (payload) => onAckMessage(payload));
        // Queues
        pmaService.onEvent("newQueue", (payload) => onNewQueue(payload));
        pmaService.onEvent("updateQueue", (payload) => onUpdateQueue(payload));
        pmaService.onEvent("takeQueueResponse", (payload) => onTakeQueueResponse(payload));
        // Operator Status
        pmaService.onEvent("operatorStatusUpdate", (payload) => onOperatorStatusUpdate(payload));
    };

    const queryClient = useQueryClient();

    const onMessage = (message) => {
        const shouldBeSent = !get(message, "shouldNotBeSent", false);
        if (shouldBeSent) {
            if (get(message, "sender.providerId", "") === currentUserSession.current.providerId) {
                return;
            }
            dispatch(addMessage(message));
        }
    };

    const onAckMessage = (message) => {
        console.log("onAckMessage", message);
        const _messages = currentMessages?.current;
        const oldMessage = _messages.find((msg) => msg.id === get(message, "oldMessageId", get(message, "oldId")));
        const fixErrorMessage = {
            ...message,
            ...(!isEmpty(get(message, "response", "")) && !isEmpty(get(oldMessage, "message"))
                ? {
                      message: {
                          ...message.message,
                          textError: get(message, `response.error.clientMessages[${lang}]`, "Error"),
                      },
                  }
                : {}),
        };
        if (oldMessage) {
            return dispatch(
                ackMessage({
                    ...fixErrorMessage,
                    oldId: oldMessage.id,
                })
            );
        }

        if (get(message, "senderId", "") === currentUserSession.current.providerId) {
            dispatch(addMessage(message));
        }
    };

    const onAddedToRoom = (room) => {
        // console.log("onAddedToRoom", room);
        if (isEmpty(room) || room.kind === "group") {
            return;
        }
        const roomId = get(room, "id", "");

        queryClient.setQueryData(["rooms", ROOM_TYPES.CLIENT], (oldRooms) => {
            const isInOldRooms = oldRooms.find((room) => room.id === roomId);
            if (isInOldRooms) {
                return;
            }
            const update = (oldRooms) => {
                const _rooms = parseRoom(room);
                const mergedRooms = mergeById(oldRooms, _rooms);
                return mergedRooms;
            };
            return update(oldRooms);
        });
    };

    const onRemovedFromRoom = (payload) => {
        console.log("onRemovedFromRoom", payload);
        const { roomId } = payload;
        dispatch(deleteVerifyStatus(roomId));
        dispatch(deleteSidebarChanged(roomId));
        queryClient.setQueryData(["rooms", ROOM_TYPES.CLIENT], (oldRooms) => {
            return oldRooms.filter((room) => room.id !== roomId);
        });
    };

    const onStateChange = (state) => {
        console.log("state", state);
    };

    const onAssignMail = (assign) => {
        console.log("onAssignMail", assign);
    };
    const onUpdateEmail = (payload) => {
        console.log("onUpdateEmail", payload);
    };

    const onReplyNewMail = (payload) => {
        console.log("onReplyNewMail", payload);
    };
    const onEmailsReplyUpdate = (payload) => {
        console.log("onEmailsReplyUpdate", payload);
    };

    // Queues
    const onNewQueue = (payload) => {
        console.log("onNewQueue", payload);
        const eventId = get(payload, "_id", "");
        JelouApiV1.get(`/real-time-events/${eventId}`).then(({ data }) => {
            const payloadData = get(data, "data.payload", {});
            dispatch(addQueue(payloadData));
        });
    };
    const onUpdateQueue = (payload) => {
        const eventId = get(payload, "_id", "");
        JelouApiV1.get(`/real-time-events/${eventId}`).then(({ data }) => {
            const payloadData = get(data, "data.payload", {});
            const id = get(payloadData, "_id", null);
            const state = get(payloadData, "state", null);
            dispatch(updateQueue(payloadData));
            if (state === "assigned") {
                dispatch(deleteQueue(id));
            }
        });
    };
    const onTakeQueueResponse = (payload) => {
        console.log("onTakeQueueResponse", payload);
    };

    // Operator Status
    const onOperatorStatusUpdate = (payload) => {
        const eventId = get(payload, "_id", "");

        JelouApiV1.get(`/real-time-events/${eventId}`).then(({ data }) => {
            const payloadEvent = get(data, "data.payload", {});
            const status = get(payloadEvent, "status", "");
            const operatorId = get(payloadEvent, "id", "");
            const currentOperatorId = currentUserSession.current?.operatorId;
            if (operatorId.toString() === currentOperatorId.toString()) {
                dispatch(updateUserSession({ operatorActive: status }));
            }
        });
    };
};

export default EventListenerLayout;
