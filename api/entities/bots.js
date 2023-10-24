import { get, isEmpty } from "lodash";
import JelouApiV1 from "../JelouApiV1";

export async function getUser({ botId, userId }) {
    try {
        const { data } = await JelouApiV1.get(`bots/${botId}/users/${userId}`);
        return data;
    } catch (err) {
        console.log(err);
    }
}

export async function getFlows({ botId }) {
    try {
        const { data } = await JelouApiV1.get(`/bots/${botId}/flows`, {
            params: {
                shouldPaginate: false,
                state: true,
                hasBubbles: true,
            },
        });
        return data;
    } catch (err) {
        console.log(err);
    }
}

export async function getStoredParams({ botId, userId }) {
    try {
        const { data } = await JelouApiV1.get(`/bots/${botId}/users/${userId}/storedParams/legacy`);
        const params = get(data, "data", {});
        return params;
    } catch (err) {
        console.log(err);
    }
}

export async function postStoredParams({ botId = "", userId = "", trimParams = {} }) {
    try {
        const { data } = await JelouApiV1.post(`bots/${botId}/users/${userId}/storedParams/legacy`, trimParams);
        return data;
    } catch (err) {
        console.log(err);
    }
}

export async function updateName({ botId = "", roomId = "", name }) {
    try {
        const { data } = await JelouApiV1.post(`bots/${botId}/rooms/${roomId}/update`, { names: name });
        return data;
    } catch (err) {
        console.log(err);
    }
}

export async function postRoomTags({ botId = "", tags = [], roomId = "" }) {
    try {
        const { data } = await JelouApiV1.post(`/bots/${botId}/rooms/tags`, { tags, roomId });
        return data;
    } catch (err) {
        console.log(err);
    }
}

export async function getUserHistory({ botId = "", userId = "", limit = 10, events = "", direction = "false", _id = "", includeEvents = "" }) {
    try {
        const { data } = await JelouApiV1.get(`bots/${botId}/users/${userId}/v2/history`, {
            limit,
            ...(events ? { events } : {}),
            ...(isEmpty(direction) ? {} : { direction }),
            ...(isEmpty(_id) ? {} : { _id }),
            ...(includeEvents ? { includeEvents } : {}),
        });
        return data.chat;
    } catch (error) {
        console.log(error);
    }
}

export async function getBotEmails({ botId = "", sort = "ASC", supportTicketId = "", limit = 1 }) {
    try {
        const {
            data: { results },
        } = await JelouApiV1.get(`/bots/${botId}/emails`, {
            params: {
                ...(isEmpty(sort) ? {} : { sort }),
                ...(isEmpty(supportTicketId) ? {} : { supportTicketId }),
                ...(isEmpty(limit) ? {} : { limit }),
            },
        });
        return results;
    } catch (error) {
        console.warn("error al obtener el email", { error });
        throw error;
    }
}

export async function uploadImages({ botId, formData, config }) {
    try {
        const { data } = await JelouApiV1.post(`/bots/${botId}/images/upload`, formData, config);
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function getRoomConversation({ botId = "", roomId = "" }) {
    try {
        const { data: response } = await JelouApiV1.get(`bots/${botId}/rooms/${roomId}/conversation`);
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function sendUserIntoAFlow({ botId = "", userId = "", flowId }) {
    try {
        await JelouApiV1.post(`/bots/${botId}/users/${userId}/flow/${flowId}`);
    } catch (error) {
        console.log(error);
    }
}

// hsm
export async function getTemplates({ botId = "", type, teamIds = [], isVisible = 1, status, shouldPaginate = false }) {
    try {
        const { data: response } = await JelouApiV1.get(`/bots/${botId}/templates/`, {
            params: {
                type,
                teamIds,
                isVisible,
                ...(isEmpty(status) ? {} : { status }),
                shouldPaginate,
            },
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function getBots({ state = 1, type = "Whatsapp", inProduction = true }) {
    try {
        const { data } = JelouApiV1.get("/bots", {
            params: {
                state,
                type,
                inProduction,
            },
        });
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function setUserCache({ botId = "", userId = "", operatorId = "", isBroadcastUser = false }) {
    try {
        const response = await JelouApiV1.post(`/bots/${botId}/users/${userId}/cache`, {
            params: {
                operatorId,
                isBroadcastUser,
            },
        });
    } catch (error) {
        console.log(error);
    }
}

export async function getDownloadConversations({ botId = "" }) {
    try {
        const response = await JelouApiV1.get(`/bots/${botId}/conversations/${id}/download`, {
            responseType: "blob",
        });
        return response;
    } catch (error) {}
}
