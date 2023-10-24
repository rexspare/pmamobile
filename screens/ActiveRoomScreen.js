import { StyleSheet, FlatList, View } from "react-native";
import Fuse from "fuse.js";
import React, { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { isEmpty, reverse, sortBy } from "lodash";
import { useQueryClient } from "@tanstack/react-query";
import RoomList from "../components/chats/RoomList";
import RoomsSkeleton from "../components/skeleton/RoomsSkeleton";
import colors from "../constants/colors";
import { ROOM_TYPES, FUSE_OPTIONS } from "../constants/constants";
import EmptyRoomList from "../components/chats/EmptyRoomList";
import LeaveModal from "../components/modals/LeaveModal";
import TransferModal from "../components/modals/TransferModal";

function ActiveRoomScreen(props) {
    const { isLoadingRooms, sortOrder } = props;
    const queryClient = useQueryClient();
    const rooms = queryClient.getQueryData({ queryKey: ["rooms", ROOM_TYPES.CLIENT] }) || [];
    const userSession = useSelector((state) => state.userSession);
    const queryChatSearch = useSelector((state) => state.queryChatSearch);
    const [prevOpenedRow, setPrevOpenedRow] = useState(null);
    const { names } = userSession;

    const [leaveModalVisibility, setLeaveModalVisibility] = useState({ show: false, room: {}, bot: {} });
    const [transferInfo, addTransferInfo] = useState({});
    const bottomSheetModalRef = useRef(null);

    if (isLoadingRooms) {
        return <RoomsSkeleton />;
    }

    const getFilteredRooms = () => {
        const _rooms = rooms.filter((room) => room.type !== "reply" && room.type !== "ticket" && room.kind !== "group");
        if (isEmpty(queryChatSearch)) {
            if (sortOrder === "asc_message") {
                return reverse(sortBy(_rooms, ["lastMessageAt"]));
            }

            if (sortOrder === "desc_message") {
                return sortBy(_rooms, ["lastMessageAt"]);
            }

            if (sortOrder === "asc_chat") {
                return reverse(sortBy(_rooms, ["conversation.createdAt", "lastMessageAt"]));
            }

            if (sortOrder === "desc_chat") {
                return sortBy(_rooms, ["conversation.createdAt", "lastMessageAt"]);
            }

            if (isEmpty(sortOrder)) {
                return sortBy(_rooms, ["lastMessageAt"]);
            }

            return reverse(sortBy(_rooms, ["lastMessageAt"]));
        }

        const fuse = new Fuse(_rooms, FUSE_OPTIONS);
        const result = fuse.search(queryChatSearch);
        const room = [];
        result.map((rooms) => room.push(rooms.item));
        return room;
    };

    const sortRooms = getFilteredRooms();
    const row = [];

    return (
        <View style={styles.container}>
            <FlatList
                data={sortRooms}
                renderItem={(propFlatlist) => (
                    <RoomList
                        {...props}
                        {...propFlatlist}
                        room={propFlatlist.item}
                        row={row}
                        prevOpenedRow={prevOpenedRow}
                        setPrevOpenedRow={setPrevOpenedRow}
                        addTransferInfo={addTransferInfo}
                        bottomSheetModalRef={bottomSheetModalRef}
                        setLeaveModalVisibility={setLeaveModalVisibility}
                    />
                )}
                ListEmptyComponent={<EmptyRoomList names={names} />}
                keyExtractor={(room) => room._id}
            />
            <TransferModal bottomSheetModalRef={bottomSheetModalRef} {...transferInfo} {...props} />
            <LeaveModal leaveModalVisibility={leaveModalVisibility} setLeaveModalVisibility={setLeaveModalVisibility} {...props} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    swipeContainer: { flexDirection: "row", justifyContent: "center", width: "45%" },
    swipeTextTransfer: {
        flexDirection: "column",
        flex: 1,
        backgroundColor: colors.neutral[600],
        alignItems: "center",
        justifyContent: "center",
    },
    swipeTextArchive: {
        flexDirection: "column",
        flex: 1,
        backgroundColor: colors.primary[500],
        alignItems: "center",
        justifyContent: "center",
    },
    swipeText: {
        color: "white",
        padding: 8,
        fontWeight: "600",
    },
});

export default ActiveRoomScreen;
