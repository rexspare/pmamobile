import { View, StyleSheet } from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import colors from "../constants/colors";
import TicketList from "../components/chats/TicketList";
import SearchRoom from "../components/chats/SearchRoom";
import TopTabNavigatorForRooms from "../navigation/TopTabNavigator";

import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { useRooms } from "../api/query/useRooms";
import { ROOM_TYPES } from "../constants/constants";
import { useTeams } from "../api/query/useTeams";
import { addTeams } from "../reducers/teams";
import { isEmpty, reverse, sortBy } from "lodash";
import UnreadScreen from "./UnreadScreen";

const UnreadChatListScreen = (props) => {
    const userSession = useSelector((state) => state.userSession);
    const company = useSelector((state) => state.company);

    const dispatch = useDispatch();
    const [sortOrder, setSortOrder] = useState("desc");

    const { data: rooms = [], isLoading: isLoadingRooms } = useRooms({
        userId: userSession.providerId,
        shouldPaginate: false,
        addConversations: true,
        type: ROOM_TYPES.CLIENT,
    });

    const { data: teams, refetch: getTeams } = useTeams({ companyId: company.id });

    useEffect(() => {
        dispatch(addTeams(teams));
    }, [teams]);

    useEffect(() => {
        if (!isEmpty(company)) {
            getTeams();
        }
    }, [company]);

    const sortedArchivedRooms = useMemo(() => {
        if (sortOrder === "asc_message") {
            return reverse(sortBy(rooms, ["lastMessageAt"]));
        }

        if (sortOrder === "desc_message") {
            return sortBy(rooms, ["lastMessageAt"]);
        }

        if (sortOrder === "asc_chat") {
            return reverse(sortBy(rooms, ["conversation.createdAt", "lastMessageAt"]));
        }

        if (sortOrder === "desc_chat") {
            return sortBy(rooms, ["conversation.createdAt", "lastMessageAt"]);
        }

        if (isEmpty(sortOrder)) {
            return sortBy(rooms, ["lastMessageAt"]);
        }

        return reverse(sortBy(rooms, ["lastMessageAt"]));
    }, [rooms, sortOrder]);

    return (
        <SafeAreaView edges={["right", "left"]} style={styles.container}>
            <TicketList />
            <SearchRoom rooms={sortedArchivedRooms} setSortOrder={setSortOrder} sortOrder={sortOrder} {...props} />
            {/* <TopTabNavigatorForRooms isLoadingRooms={isLoadingRooms} /> */}
            <UnreadScreen {...props} isLoadingRooms={isLoadingRooms} userSession={userSession} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    text: {
        fontSize: 16,
    },
    textTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: colors.primary[500],
    },
    searchBoxContainer: {
        flexDirection: "row",
    },
});

export default UnreadChatListScreen;