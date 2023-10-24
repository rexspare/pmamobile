import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import colors from "../constants/colors";
import { useSelector } from "react-redux";
import { useArchivedRooms } from "../api/query/useArchivedRooms";
import ArchivedRoomList from "../components/chats/ArchivedRoomList";
import HeaderArchivedChatList from "../components/chats/HeaderArchivedChatList";
import RoomsSkeleton from "../components/skeleton/RoomsSkeleton";
import { get, isEmpty, reverse, sortBy } from "lodash";
import { useQueryClient } from "@tanstack/react-query";
import { ROOM_TYPES } from "../constants/constants";
import { useRefreshOnFocus } from "../hooks/useRefreshOnFocus";
import HeaderIcon from "../components/chats/HeaderIcon";

const ArchivedChatScreen = (props) => {
    const { navigation } = props;
    const queryClient = useQueryClient();
    const userSession = useSelector((state) => state.userSession);
    const rooms = queryClient.getQueryData({ queryKey: ["rooms", ROOM_TYPES.CLIENT] }) || [];
    const [sortOrder, setSortOrder] = useState("desc");

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <HeaderIcon navigation={navigation} />,
        });
    }, [navigation]);

    const roomsId = rooms.map((room) => {
        let senderId = get(room, "id");
        if (senderId === undefined) {
            senderId = get(room, "senderId");
        }
        return senderId;
    });
    const { data, isLoading, isFetching, hasNextPage, fetchNextPage, refetch } = useArchivedRooms({
        operatorId: userSession?.operatorId,
        limit: 10,
        ignoreRooms: `${roomsId}`,
    });
    const { pages = [] } = data || {};
    const allArchivedRooms = useMemo(() => pages.flatMap((page) => page.results), [data]);

    useRefreshOnFocus(refetch);

    const sortedArchivedRooms = useMemo(() => {
        if (sortOrder === "asc_message") {
            return reverse(sortBy(allArchivedRooms, ["lastMessageAt"]));
        }

        if (sortOrder === "desc_message") {
            return sortBy(allArchivedRooms, ["lastMessageAt"]);
        }

        if (sortOrder === "asc_chat") {
            return reverse(sortBy(allArchivedRooms, ["conversation.createdAt", "lastMessageAt"]));
        }

        if (sortOrder === "desc_chat") {
            return sortBy(allArchivedRooms, ["conversation.createdAt", "lastMessageAt"]);
        }

        if (isEmpty(sortOrder)) {
            return sortBy(allArchivedRooms, ["lastMessageAt"]);
        }

        return reverse(sortBy(allArchivedRooms, ["lastMessageAt"]));
    }, [allArchivedRooms, sortOrder]);

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        refetch();
        setTimeout(() => {
            setRefreshing(false);
        }, 500);
    }, []);

    return (
        <View style={styles.containerArchivedChatScreen}>
            <HeaderArchivedChatList {...props} setSortOrder={setSortOrder} sortOrder={sortOrder} />
            {isLoading ? (
                <RoomsSkeleton />
            ) : (
                <FlatList
                    data={sortedArchivedRooms}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    refreshing={refreshing}
                    renderItem={(propFlatlist) => <ArchivedRoomList {...props} {...propFlatlist} archivedRoom={propFlatlist.item} />}
                    onEndReachedThreshold={0.6}
                    onEndReached={({ distanceFromEnd }) => {
                        if (!hasNextPage) return;
                        fetchNextPage();
                    }}
                />
            )}
        </View>
    );
};

export default ArchivedChatScreen;

const styles = StyleSheet.create({ containerArchivedChatScreen: { backgroundColor: colors.white, flex: 1 } });
