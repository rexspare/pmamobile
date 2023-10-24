import "dayjs/locale/es";
import dayjs from "dayjs";
import { isEmpty, get } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

import colors from "../../constants/colors";
import SourceType from "../common/SourceType";
import { getName } from "../../utils/helpers";
import { useArchivedMessages } from "../../api/query/useMessages";
import { addArchivedMessages } from "../../reducers/archivedMessages";

const ArchivedRoomList = (props) => {
    const { archivedRoom = {}, navigation } = props;
    const userSession = useSelector((state) => state.userSession);
    const { lang = "es" } = userSession;
    const { room = {}, bot: _bot = {}, lastMessageAt = "", user = {} } = archivedRoom;
    const { name: botName, type, id: botId } = _bot;
    const { id: userId } = user;
    const name = getName(room, user);
    const bots = useSelector((state) => state.bots);
    const [bot, setBot] = useState({});
    const dispatch = useDispatch();

    const hasEnabledEvents = get(bot, "properties.hasEnabledEvents", true);
    const lastMessageId = null;
    const options = {
        botId,
        userId,
        ...(hasEnabledEvents ? { includeEvents: true } : { includeEvents: false }),
        ...(lastMessageId ? { _id: lastMessageId } : {}), // this is for global search
    };

    const { data: message, refetch } = useArchivedMessages(options);

    useEffect(() => {
        if (!isEmpty(message)) {
            dispatch(addArchivedMessages(message));
        }
    }, [message]);

    useEffect(() => {
        if (!isEmpty(bots)) {
            setBot(bots.find((botMapped) => botMapped.id === botId));
        }
    }, [bots]);

    return (
        <TouchableOpacity
            style={styles.roomContainer}
            onPress={() => {
                navigation.navigate("ArchivedRoomScreen", {
                    room: archivedRoom,
                    bot,
                });
                refetch();
            }}>
            <SourceType style={styles.sourceTypeStyle} source={type} />
            <View style={styles.infoText}>
                <Text style={styles.nameHeader}>{name}</Text>
                <View style={styles.moreInfo}>
                    <Text style={styles.moreInfoText}>{botName}</Text>
                    <Text style={styles.moreInfoText}>{dayjs(lastMessageAt).locale(lang).format("MMM D - HH:mm", "es")}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    roomContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.white,
        paddingHorizontal: 10,
        paddingVertical: 5,
        height: 70,
        borderBottomColor: colors.gray.outline,
        borderBottomWidth: 0.2,
        justifyContent: "space-evenly",
    },
    sourceTypeStyle: { marginRight: 10 },
    infoText: {
        paddingHorizontal: 10,
        flexDirection: "column",
        flex: 1,
        height: "100%",
        justifyContent: "space-evenly",
    },
    nameHeader: {
        fontSize: 16,
        fontWeight: "600",
        color: colors.default,
        paddingBottom: 2,
    },
    moreInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    moreInfoText: {
        fontSize: 12,
        fontWeight: "300",
        color: colors.gray[200],
        paddingBottom: 2,
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

export default ArchivedRoomList;
