import { configureStore } from "@reduxjs/toolkit";
import archivedMessages from "../reducers/archivedMessages";
import bots from "../reducers/bots";
import company from "../reducers/company";
import login from "../reducers/login";
import messages from "../reducers/messages";
import permissions from "../reducers/permissions";
import queryChatSearch from "../reducers/queryChatSearch";
import querySearch from "../reducers/query";
import queues from "../reducers/queues";
import rooms from "../reducers/rooms";
import sidebarChannel from "../reducers/sidebarChannel";
import statusOperator from "../reducers/statusOperator";
import tags from "../reducers/tags";
import teams from "../reducers/teams";
import unauthorized from "../reducers/autorization";
import userSession from "../reducers/userSession";
import verifyStatus from "../reducers/verifyStatus";
import sidebarChanged from "../reducers/sidebarChanged";

export const Store = configureStore({
    reducer: {
        archivedMessages,
        bots,
        company,
        login,
        messages,
        permissions,
        queryChatSearch,
        querySearch,
        queues,
        rooms,
        sidebarChannel,
        statusOperator,
        tags,
        teams,
        unauthorized,
        userSession,
        verifyStatus,
        sidebarChanged,
    },
    devTools: true,
});
