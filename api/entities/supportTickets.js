import JelouApiV1 from "../JelouApiV1";

export async function getEmails({
    limit = 10,
    page = 0,
    onlyInbound,
    startAt,
    endAt,
    sort,
    status,
    priority,
    isFavorite,
    search,
    searchBy,
    operatorId,
    teamId,
    botId,
    createdBy,
    tags = [],
    dueDate,
    read,
}) {
    try {
        await JelouApiV1.post(`/support-tickets/`, {
            limit,
            page,
            ...(isEmpty(onlyInbound) ? {} : { onlyInbound }),
            ...(!isEmpty(startAt) ? { startAt } : {}),
            ...(!isEmpty(endAt) ? { endAt } : {}),
            ...(sort ? { sort } : {}),
            ...(status ? { status } : {}),
            ...(priority ? { priority } : {}),
            ...(isFavorite ? { isFavorite } : {}),
            ...(search ? { search } : {}),
            ...(searchBy ? { searchBy } : {}),
            ...(!isEmpty(operatorId) ? { operatorId } : {}),
            ...(!isEmpty(teamId) ? { teamId } : {}),
            ...(!isEmpty(botId) ? { botId } : {}),
            ...(createdBy ? { createdBy } : {}),
            ...(tags ? { tags } : {}),
            ...(dueDate ? { dueDate: { lte: dueDate } } : {}),
            ...(read ? { read } : {}),
        });
    } catch (err) {
        console.log(err);
    }
}

export async function getEmail({ emailId = "" }) {
    try {
        const { data } = await JelouApiV1.get(`/support-tickets/${emailId}`);
        return data.data;
    } catch (err) {
        console.log(err);
    }
}

export async function updateEmail({
    emailId = "",
    creationDetails = {},
    isFavorite = "",
    priority = "",
    status = "",
    dynamicEventId = "",
    sort = "",
    limit = 10,
    dueAt = "",
}) {
    const response = await JelouApiV1.put(`support-tickets/${emailId}`, {
        ...(!isEmpty(creationDetails) ? { creationDetails } : {}),
        ...(!isEmpty(isFavorite) ? { isFavorite } : {}),
        ...(!isEmpty(priority) ? { priority } : {}),
        ...(!isEmpty(status) ? { status } : {}),
        ...(status === "closed" ? { dynamicEventId } : {}),
        ...(!isEmpty(sort) ? { sort } : {}),
        ...(!isEmpty(limit) ? { limit } : {}),
        ...(!isEmpty(dueAt) ? { dueAt } : {}),
    });
    return response;
}

export async function assignEmail({ notAssignedTab = "", teamId = "", operatorId = "", supportTicketId }) {
    try {
        const data = await JelouApiV1.post(`/support-tickets/assign`, {
            origin: notAssignedTab ? "induced_by_admin" : "transfer",
            // ...(byTeam ? { teamId: id } : { operatorId: value }),
            ...(!teamId ? { teamId } : {}),
            ...(!operatorId ? { operatorId } : {}),
            supportTicketId,
        });
    } catch (error) {
        console.log(error);
    }
}
