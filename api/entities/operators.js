import { get, isEmpty, omit } from "lodash";
import JelouApiV1 from "../JelouApiV1";
import JelouApiV2 from "../JelouApiV2";

export async function getOperatorsSignature() {
    try {
        const { data: response } = await JelouApiV1.get("/operators/signatures");
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function sendOperatorsMessage(formMessage) {
    try {
        const message = omit(formMessage, ["source"]);
        const data = await JelouApiV1.post("/operators/message", message);
        return data;
    } catch (error) {
        console.log("sendOperatorsMessage", error);
    }
}

export async function createNewSignature({ newSignature = {} }) {
    try {
        const data = JelouApiV1.post("operators/signatures/create", newSignature);
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function getOperators({ active = 1, status = "online", byScope = false, teams = [] }) {
    const params = {
        active,
        status,
        ...(byScope && !isEmpty(teams) ? { teams: teams.map(team => team.id) } : {})
    };
    const { data } = await JelouApiV1.get("/operators", { params });
    return data;
}

export async function createEventMesaage({ botId = "", userId = "", bubble = {} }) {
    try {
        await JelouApiV1.post("/operators/event", {
            botId,
            userId,
            bubble,
        });
    } catch (error) {
        console.log(error);
    }
}

export async function getStats({ operatorId = "" }) {
    try {
        const { data } = await JelouApiV1.get(`/operators/${operatorId}/stats`);
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function updateOperatorStatus({ operatorId = "", status = "", sessionId = "" }) {
    const response = await JelouApiV1.patch(`/operators/${operatorId}`, {
        status,
        sessionId,
    });
    return response;
}

export async function getArchivedRooms({ payload = { operatorId: "", limit: 10 }, pageParam = 1 }) {
    try {
        const { data } = await JelouApiV2.get(`/operators/archived`, { params: { ...payload, page: pageParam } });
        return data;
    } catch (error) {
        console.log(error);
    }
}
