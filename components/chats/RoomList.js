import { View, Text, StyleSheet, Pressable, Animated, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import get from "lodash/get";
import sortBy from "lodash/sortBy";
import dayjs from "dayjs";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { cloneDeep, first, has, isEmpty, set } from "lodash";
import { useQueryClient } from "@tanstack/react-query";
import colors from "../../constants/colors";
import SourceType from "../common/SourceType";
import "dayjs/locale/es";
import ManagedIconRoom from "./ManagedIconRoom";
import { bots } from "../../test/bots";
import TransferIcon from "../icons/TransferIcon";
import ArchivedIcon from "../icons/ArchivedIcon";
import { useMessages } from "../../api/query/useMessages";
import { addMessages } from "../../reducers/messages";
import { setSidebarChanged } from "../../reducers/sidebarChanged";
import { setVerifyStatus } from "../../reducers/verifyStatus";
import MessagePreview from "../common/MessagePreview";
import { updateRoom } from "../../api/entities/rooms";
import { ROOM_TYPES } from "../../constants/constants";
import { mergeById } from "../../utils/helpers";

const RoomList = (props) => {
    const { room = {}, index, row = [], prevOpenedRow, setPrevOpenedRow, addTransferInfo, bottomSheetModalRef, setLeaveModalVisibility } = props;
    const queryClient = useQueryClient();
    const userSession = useSelector((state) => state.userSession);
    const company = useSelector((state) => state.company);
    const teams = useSelector((state) => state.teams);
    const { lang = "es" } = userSession;
    const { providerId } = userSession;
    const { name = "", bot: _bot = {}, lastMessageAt = "" } = room;
    const { conversation = {} } = room;
    const botName = get(_bot, "name", "");
    const { messages: messagesFromRoom = [] } = room;
    const isNew = get(room, `membersMetaInfo[${providerId}].isNew`, false);
    const unreadMessages = get(room, `membersMetaInfo[${providerId}].unreadMessages`, 0);
    const [lastMessage, setLastMessage] = useState({});
    const bots = useSelector((state) => state.bots);
    const [bot, setBot] = useState({});
    const tags = get(room, "tags", []);

    const dispatch = useDispatch();

    const options = { roomId: room?.id, limit: 20, botId: room.bot?.id, userId: room?.senderId };
    const { data: message, refetch: refetchMessages, isFetching: isRefetchingMessages } = useMessages(options);
    const messages = useSelector((state) => state.messages);

    const getRoomLastMessage = () => {
        const roomMessages = messagesFromRoom.filter((message) => message.roomId === room.id);

        const sortedMessages = sortBy(roomMessages, (data) => new Date(data.createdAt));

        const message = sortedMessages.pop();
        if (message) {
            setLastMessage(message);
        }
    };

    useEffect(() => {
        if (!isEmpty(bots)) {
            setBot(bots.find((bot) => bot.id === _bot?.id));
        }
    }, [bots]);

    useEffect(() => {
        if (!isEmpty(message)) {
            dispatch(addMessages(message));
        }
    }, [message]);

    // Update lastMessage when messages or rooms is updated
    useFocusEffect(
        useCallback(() => {
            getRoomLastMessage();
        }, [messages, room])
    );

    const archiveRoom = (evt) => {
        const bot = bots.find((bot) => bot.id === room.bot?.id);
        setLeaveModalVisibility({ show: true, room, bot });
        evt.close();
    };

    const transferRoom = (evt) => {
        const bot = bots.find((bot) => bot.id === room.bot?.id);
        addTransferInfo({ room, bot });
        bottomSheetModalRef.current?.present();
        evt.close();
    };

    const getSideBarSettings = useCallback(() => {
        const teamId = first(get(userSession, "teams", []));
        const teamObj = teams.find((team) => team.id === teamId);
        const teamSettingsLegacy = get(teamObj, "properties.sidebar_settings", []);
        const teamSettings = get(teamObj, "properties.sidebarSettings", []);

        const botSettings = get(bot, "properties.sidebar_settings", []);
        const companySettings = get(company, "properties.sidebar_settings", []);

        if (!isEmpty(teamSettingsLegacy)) {
            return teamSettingsLegacy;
        }
        if (!isEmpty(teamSettings)) {
            return teamSettings;
        }
        if (!isEmpty(botSettings)) {
            return botSettings;
        }
        if (!isEmpty(companySettings)) {
            return companySettings;
        }
        return [];
    }, [userSession, teams, bot, company]);

    const sidebarSettings = getSideBarSettings();
    const hasSidebarSettingsEnabled = !isEmpty(sidebarSettings) || !isEmpty(tags);

    const hasPlugin = get(bot, "properties.operatorView.plugin");
    const companyPermission = company.id === 35;
    const sidebarChangedSelector = useSelector((state) => state.sidebarChanged); // this is when changed sidebar you can close conversation
    const verifyStatusSelector = useSelector((state) => state.verifyStatus); // this helps when doing validations for sidebar forms

    const sidebarChanged = sidebarChangedSelector.find((status) => status.roomId === room?.id);
    const verifyStatus = verifyStatusSelector.find((status) => status.roomId === room?.id);

    const sidebarValidations = hasSidebarSettingsEnabled || hasPlugin ? sidebarChanged?.paramsChanged && verifyStatus?.status : true;

    const canSwitch = get(bot, "properties.operatorView.canSwitch")
        ? get(bot, "properties.operatorView.canSwitch")
        : get(company, "properties.operatorView.canSwitch", true);

    let canCloseConversation = companyPermission || sidebarValidations;
    canCloseConversation = has(company, "properties.operatorView.forceClose")
        ? get(company, "properties.operatorView.forceClose", canCloseConversation)
        : companyPermission || sidebarValidations;

    useEffect(() => {
        if (isEmpty(sidebarChanged)) {
            dispatch(setSidebarChanged({ roomId: room.id, paramsChanged: false }));
        }
        if (isEmpty(verifyStatus)) {
            dispatch(setVerifyStatus({ roomId: room.id, status: true }));
        }
    }, [sidebarChanged, verifyStatus]);

    const rightActionsOptions = (progress, dragX, evt) => {
        const container =
            canSwitch && canCloseConversation
                ? { ...styles.swipeContainer }
                : canSwitch || canCloseConversation
                ? { ...styles.swipeContainer, width: "22%" }
                : { ...styles.swipeContainer, width: "0%" };
        return (
            <View style={container}>
                {canSwitch && (
                    <TouchableOpacity style={styles.swipeTextTransfer} onPress={() => transferRoom(evt)}>
                        <TransferIcon />
                        <Text style={styles.swipeText}>Transferir</Text>
                    </TouchableOpacity>
                )}
                {canCloseConversation && (
                    <TouchableOpacity style={styles.swipeTextArchive} onPress={() => archiveRoom(evt)}>
                        <ArchivedIcon style={{ color: colors.white }} />
                        <Text style={{ ...styles.swipeText, marginTop: 4 }}>Archivar</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const closeRow = (index) => {
        if (prevOpenedRow && prevOpenedRow !== row[index] && !isEmpty(prevOpenedRow)) {
            prevOpenedRow.close();
        }
        setPrevOpenedRow(row[index]);
    };

    const resetBackendCountMessages = async (room) => {
        try {
            let updatedRoom = cloneDeep(room);

            if (!isEmpty(updatedRoom.membersMetaInfo) && !isEmpty(updatedRoom.membersMetaInfo[providerId])) {
                updatedRoom = {
                    ...updatedRoom,
                    membersMetaInfo: {
                        ...updatedRoom.membersMetaInfo,
                        [providerId]: {
                            unreadMessages: 0,
                            isNew: false,
                        },
                    },
                };
            }

            queryClient.setQueryData(["rooms", ROOM_TYPES.CLIENT], (oldRooms) => {
                const update = (oldRooms) => {
                    const mergedRooms = mergeById(oldRooms, updatedRoom);
                    return mergedRooms;
                };
                return update(oldRooms);
            });

            await updateRoom({ roomId: room.id, read: true });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Swipeable
            renderRightActions={rightActionsOptions}
            onSwipeableOpen={() => closeRow(index)}
            ref={(ref) => (row[index] = ref)}
            friction={2}
            overshootRight={false}
            rightThreshold={0.1}>
            <Pressable
                style={isNew ? styles.newRoomContainer : styles.roomContainer}
                onPress={() => {
                    resetBackendCountMessages(room);
                    refetchMessages();
                    props.navigation.navigate("RoomScreen", { room, messages, isRefetchingMessages });
                }}>
                <View style={styles.unreadMessageInfo}>
                    {isNew ? (
                        <View style={styles.isNewTextContainer}>
                            {unreadMessages > 0 ? (
                                <View style={styles.unreadNotificationBadge}>
                                    <Text style={styles.unreadNotificationText}>{unreadMessages}</Text>
                                </View>
                            ) : null}
                            <Text style={styles.isNewText}>Nuevo</Text>
                        </View>
                    ) : null}
                </View>
                <SourceType style={styles.sourceTypeStyle} source={room.channelProvider} />
                <View style={styles.infoText}>
                    <Text style={styles.nameHeader}>{name}</Text>
                    <MessagePreview message={lastMessage} />
                    <View style={styles.moreInfo}>
                        <Text style={styles.moreInfoText}>{botName}</Text>
                        <Text style={styles.moreInfoText}>{dayjs(lastMessageAt).locale(lang).format("MMM D - HH:mm", "es")}</Text>
                    </View>
                    <ManagedIconRoom conversation={conversation} />
                </View>
            </Pressable>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
    roomContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.white,
        paddingHorizontal: 10,
        paddingVertical: 5,
        height: 100,
        borderBottomColor: colors.gray.outline,
        borderBottomWidth: 0.2,
        justifyContent: "space-evenly",
    },
    newRoomContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.primary[50],
        paddingHorizontal: 10,
        paddingVertical: 5,
        height: 100,
        borderBottomColor: colors.gray.outline,
        borderBottomWidth: 0.2,
        justifyContent: "space-evenly",
        position: "relative",
    },
    unreadMessageInfo: {
        position: "absolute",
        margin: 5,
        padding: 3,
        top: 0,
        right: 0,
        flexDirection: "row",
    },
    isNewTextContainer: {
        flexDirection: "row",
        backgroundColor: colors.primary[300],
        borderRadius: 5,
        padding: 4,
        alignItems: "center",
        justifyContent: "center",
    },
    isNewText: {
        color: colors.primary[700],
        fontSize: 14,
    },
    unreadNotificationBadge: {
        width: 18,
        height: 18,
        padding: 2,
        backgroundColor: colors.primary[700],
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 3,
        flex: 1,
        borderRadius: 16,
        paddingHorizontal: 6,
        paddingVertical: 2,
        zIndex: 2,
    },
    unreadNotificationText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: "600",
    },
    sourceTypeStyle: { marginRight: 10 },
    infoText: {
        padding: 5,
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

export default RoomList;
