import isEmpty from "lodash/isEmpty";
import { get, isNumber } from "lodash";
import DashboardServer from "../DashboardServer";
import JelouApiV1 from "../JelouApiV1";

export async function createCompanyTags({ companyId = "", name = { en: "", es: "" }, color = "", isGlobal = "", bots = [], teams = [] }) {
    try {
        await JelouApiV1.post(`/company/${companyId}/tags`, {
            name,
            color,
            ...(isEmpty(isGlobal) ? {} : { isGlobal }),
            ...(isEmpty(bots) ? {} : { bots }),
            ...(isEmpty(teams) ? {} : { teams }),
        });
    } catch (err) {
        console.log(err);
    }
}

export async function getTags({ companyId = "", teams = [], bots = [] }) {
    try {
        const { data } = await JelouApiV1.get(`/company/${companyId}/tags`, {
            params: {
                ...(!isEmpty(teams) ? { teams } : {}),
                ...(!isEmpty(bots) ? { bots: [bots] } : {}),
                joinTags: true,
            },
            // paramsSerializer: function (params) {
            //     return qs.stringify(params);
            // },
        });
        return data;
    } catch (err) {
        console.log(err);
    }
}

export async function getTeams({ companyId = "", operatorId = "", limit = 200 }) {
    try {
        const { data } = await JelouApiV1.get(`/company/${companyId}/teams`, {
            params: {
                ...(operatorId ? { operatorId } : {}),
                limit,
            },
        });
        const teams = get(data, "results", []);
        return teams;
    } catch (error) {
        console.log(error);
    }
}

export async function getMacros({ companyId = "" }) {
    try {
        const { data } = await JelouApiV1.get(`/companies/${companyId}/macros`);
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function getReplies({
    companyId = "",
    onlyRoom = true,
    status = "CLOSED_BY_OPERATOR",
    type = "reply",
    page = "",
    search = "",
    searchBy = "",
}) {
    try {
        const { data: response } = await JelouApiV1.get(`companies/${companyId}/replies`, {
            params: {
                onlyRoom: true,
                status,
                type,
                ...(page || {}),
                ...(search || {}),
                ...(searchBy || {}),
            },
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function getPostMessage({ companyId = "", roomId = "" }) {
    try {
        const { data: response } = await JelouApiV1.get(`/companies/${companyId}/reply/room/${roomId}`);
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function getCustomEvents({ companyId = "" }) {
    try {
        const { data } = await JelouApiV1.get(`/company/${companyId}/custom_events`, {
            params: {
                shouldPaginate: false,
            },
        });
        return data;
    } catch (err) {
        console.log(err);
    }
}

export async function getMacroTemplates({ companyId = "", teams = [], bots = [], shoulPaginate = false, joinMacros = false, isVisible = 1, signal }) {
    try {
        const { data } = await JelouApiV1.get(`companies/${companyId}/macros/templates`, {
            params: {
                ...(!isEmpty(teams) ? { teams } : {}),
                ...(!isEmpty(bots) ? { bots } : {}),
                shoulPaginate,
                joinMacros,
                ...(isVisible ? { isVisible } : {}),
            },
            signal,
        });
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function getReplyAdyacents({ companyId = "", replyId = "", type = "", limit = 10, page = 1 }) {
    try {
        const { data: response } = await JelouApiV1.get(`/companies/${companyId}/reply/${replyId}/adyacents`, {
            params: {
                type,
                limit,
                page,
            },
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function getChildPost({}) {
    try {
        const { data } = await JelouApiV1.get(`/companies/${companyId}/reply/${id}/children`, {
            params: {
                limit: 2,
                page: pageNext,
            },
        });
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function closePost({ companyId = "", id = "", operatorId, dynamicEventId }) {
    try {
        const response = await JelouApiV1.post(`/company/${companyId}/reply/${replyId}/close`, {
            operatorId,
            ...(dynamicEventId ? { dynamicEventId } : {}),
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function storeValuesOnLeave({ companyId = "", key, value, ttl = 3600 }) {
    try {
        await JelouApiV1.post(`/company/${companyId}/store`, {
            key,
            value,
            ttl,
        });
    } catch (error) {
        console.log(error);
    }
}

export async function startPost({ companyId = "", replyId = "", operatorId, origin }) {
    try {
        const { data } = await JelouApiV1.post(`/companies/${companyId}/reply/${replyId}/start`, {
            operatorId,
            origin,
        });
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function getTickets({ companyId = "", shouldPaginate = false, state = "in_queue", type = "" }) {
    try {
        const { data: response } = await JelouApiV1.get(`/company/${companyId}/tickets`, {
            params: {
                shouldPaginate,
                state,
            },
        });
        return response.data.results;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function takeTicket({ companyId = "", async = "", ticketId = "", operatorId = "", type = "", teamId = "", signal }) {
    // try {
    const { data } = await JelouApiV1.get(`/company/${companyId}/tickets/take`, {
        params: {
            async,
            ...(ticketId ? { ticketId } : {}),
            ...(isNumber(operatorId) ? { operatorId } : {}),
            ...(type ? { type } : {}),
            ...(isNumber(teamId) ? { teamId } : {}),
        },
        signal,
    });
    return data;
    // } catch (error) {
    //     console.log({ error });
    //     return error;
    // }
}

export async function getOperators({ companyId = "", active = 1, status = "online", teams = [] }) {
    try {
        const { data: response } = await JelouApiV1.get(`/company/${companyId}/teams/operators`, {
            params: {
                active,
                status,
                teams,
            },
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function getBots({ companyId = "", signal }) {
    try {
        const { data } = await DashboardServer.get(
            `/companies/${companyId}/bots/data`,
            {
                params: {
                    shouldPaginate: false,
                },
            },
            signal
        );
        const results = get(data, "data.results", []);
        return results;
    } catch (error) {
        console.log(error);
    }
}
