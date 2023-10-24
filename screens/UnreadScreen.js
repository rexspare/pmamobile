import { View, StyleSheet, FlatList } from "react-native";
import Fuse from "fuse.js";
import React from "react";
import colors from "../constants/colors";
import { useSelector } from "react-redux";
import RoomsSkeleton from "../components/skeleton/RoomsSkeleton";
import { SafeAreaView } from "react-native-safe-area-context";
import RoomList from "../components/chats/RoomList";
import { isEmpty, reverse, sortBy } from "lodash";
import EmptyRoomList from "../components/chats/EmptyRoomList";

const UnreadScreen = (props) => {
    const { isLoadingRooms, sortOrder, userSession } = props;
    const rooms = useSelector((state) => state.rooms);
    const queryChatSearch = useSelector((state) => state.queryChatSearch);
    const { names } = userSession;

    const fuseOptions = {
        shouldSort: true,
        threshold: 0.25,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        includeMatches: true,
        keys: ["name", "names", "senderId", "user.id", "message.text"],
    };

    if (isLoadingRooms) {
        return <RoomsSkeleton />;
    }

    const getFilteredRooms = () => {
        if (isEmpty(queryChatSearch)) {
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
        }

        const fuse = new Fuse(rooms, fuseOptions);
        const result = fuse.search(queryChatSearch);
        let room = [];
        result.map((rooms) => {
            return room.push(rooms.item);
        });
        return room;
    };

    const sortRooms = getFilteredRooms();

    return (
        <View style={styles.container}>
            <FlatList
                data={sortRooms}
                renderItem={(propFlatlist) => (
                    <RoomList
                        {...props}
                        {...propFlatlist}
                        room={propFlatlist.item}
                        // row={row}
                        // prevOpenedRow={prevOpenedRow}
                        // setPrevOpenedRow={setPrevOpenedRow}
                        // addTransferInfo={addTransferInfo}
                        // setTransferModalVisibility={setTransferModalVisibility}
                    />
                )}
                keyExtractor={(room) => room._id}
                ListEmptyComponent={<EmptyRoomList names={names} />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
});

export default UnreadScreen;
