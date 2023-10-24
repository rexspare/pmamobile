import { isEmpty } from "lodash";
import JelouApiV1 from "../JelouApiV1";

export async function startConversation({
    botId = "",
    userId = "",
    operatorId = "",
    origin = "induced_by_operator",
    hasResumeConversations = false,
    signal,
}) {
    try {
        const { data } = await JelouApiV1.post(
            `/conversations/${botId}/start`,
            {
                userId,
                operatorId,
                origin,
                ...(hasResumeConversations ? { resumeConversation: true } : {}),
            },
            signal
        );
        return data.data;
    } catch (err) {
        console.log(`/conversations/${botId}/start`, err);
        return err.response.data?.data;
    }
}

export async function closeConversation({ botId = "", operatorId = "", userId = "", dynamicEvent = {} }) {
    try {
        const { data } = await JelouApiV1.post(`/conversations/${botId}/close`, {
            operatorId,
            userId,
            ...(!isEmpty(dynamicEvent) ? { dynamicEventId: dynamicEvent.id } : {}),
        });
        return data;
    } catch (err) {
        console.log(err);
    }
}

export async function transferConversation({ botId = "", userId = "", teamId = "", operatorId = "" }) {
    try {
        const { data } = await JelouApiV1.post(`/conversations/${botId}/transfer`, {
            ...(!isEmpty(userId) ? { userId } : {}),
            ...(!isEmpty(teamId) ? { teamId } : {}),
            ...(!isEmpty(operatorId) ? { operatorId } : {}),
        });
        return data;
    } catch (error) {
        console.log(error);
    }
}
