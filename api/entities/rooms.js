import { get, isEmpty } from "lodash";
import JelouApiV1 from "../JelouApiV1";
import { parseMessage, parseRoom } from "../../utils/helpers";
import { ROOM_TYPES } from "../../constants/constants";

export async function getRooms({ userId = "", shouldPaginate = false, addConversations = false, type = ROOM_TYPES.CLIENT, signal }) {
    try {
        const { data } = await JelouApiV1.get("/rooms", {
            params: {
                userId,
                shouldPaginate,
                addConversations,
                ...(isEmpty(type) ? {} : { type }),
            },
            signal,
        });
        let rooms = get(data, "results", []);
        if (type === ROOM_TYPES.CLIENT) {
            rooms = rooms.map((room) => parseRoom(room));
        }
        return rooms;
    } catch (err) {
        console.log(err);
    }
}

export async function getRoom({ roomId = "", userId = "", shouldPaginate = false, addConversations = "", read = "" }) {
    try {
        const { data } = await JelouApiV1.get(`/rooms/${roomId}`, {
            params: {
                ...(isEmpty(userId) ? {} : { userId }),
                ...(isEmpty(shouldPaginate) ? {} : { shouldPaginate }),
                ...(isEmpty(addConversations) ? {} : { addConversations }),
                ...(isEmpty(read) ? {} : { read }),
            },
        });
        const { data: response } = data;
        return parseRoom(response);
    } catch (err) {
        console.log(err);
    }
}

export async function getRoomMessages({
    roomId = "",
    limit = "10",
    events = true,
    direction = "",
    _id = "",
    limitUp = "",
    limitBottom = "",
    userId = "",
    botId = "",
    signal,
}) {
    try {
        const { data } = await JelouApiV1.get(`/rooms/${roomId}/messages`, {
            params: {
                limit,
                ...(!events ? {} : { events }),
                ...(isEmpty(direction) ? {} : { direction }),
                ...(isEmpty(_id) ? {} : { _id }),
                ...(isEmpty(limitUp) ? {} : { limitUp }),
                ...(isEmpty(limitBottom) ? {} : { limitBottom }),
            },
            signal,
        });
        const messages = get(data, "results", []); 
        let parseMessages = messages.map((message) => parseMessage({ ...message, botId, userId }));
        return parseMessages;
    } catch (err) {
        console.log("Error at getting Room Messages", err);
    }
}

export async function updateRoom({ roomId = "", name = "", read }) {
    try {
        JelouApiV1.put(`/rooms/${roomId}`, { ...(!isEmpty(name) ? { name } : {}), ...(read ? { read: true } : {}) }).catch((err) => {
            console.log("error", err);
        });
    } catch (err) {
        console.log(err);
    }
}

export async function addTag({ roomId = "", tagId = "" }) {
    try {
        await JelouApiV1.post(`/rooms/${roomId}/tag/${tagId}/add`, {
            type: "reply",
        });
    } catch (error) {
        console.log(error);
    }
}

export async function removeTag({ roomId = "", tagId = "" }) {
    try {
        await JelouApiV1.delete(`/rooms/${roomId}/tag/${tagId}/remove`);
    } catch (error) {
        console.log(error);
    }
}

export async function transferRoom({ roomId = "", referenceIdFrom = "", referenceIdTo = "" }) {
    try {
        const response = await JelouApiV1.post(`/rooms/${roomId}/members/transfer`, {
            from: {
                referenceId: referenceIdFrom, //providerId
                memberType: "operator",
            },
            to: {
                referenceId: referenceIdTo, //providerId of the operator to transfer
                memberType: "operator",
            },
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}
