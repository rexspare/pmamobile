import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import colors from "../../constants/colors";
import EmojiIcon from "../icons/EmojiIcon";
import DownIcon from "../icons/DownIcon";
import ConnectionIcon from "../icons/ConnectionIcon";
import { updateOperatorStatus } from "../../api/entities/operators";
import { getRooms } from "../../api/entities/rooms";
import { capitalize, get, isEmpty } from "lodash";
import WarningModal from "../modals/WarningModal";
import RadioButton from "../common/RadioButton";
import { useDispatch } from "react-redux";
import { updateUserSession } from "../../reducers/userSession";

const ProfileStatus = (props) => {
    const [statusSelectorVisibility, setStatusSelectorVisibility] = useState(false);
    const { operator, company } = props;
    const { operatorId, sessionId, operatorActive, providerId } = operator;
    const [isSelected, setSelection] = useState(operatorActive);
    const { force: isForceNotLogOut = false, enabled: isEnableModalWaring = true } = get(company, "properties.operatorView.logOutWarning", {});
    const [warningModalVisibility, setWarningModalVisibility] = useState({ isOpen: false, numOfRooms: 0 });
    const dispatch = useDispatch();

    const changeStatus = (status) => {
        updateStatus(status);
        setStatusSelectorVisibility(false);
    };

    const updateStatus = async (status) => {
        try {
            await updateOperatorStatus({ operatorId, status, sessionId });
            setSelection(status);
            dispatch(updateUserSession({ operatorActive: status }));
        } catch (err) {
            console.log(err);
        }
    };

    const handleLogOut = async () => {
        const rooms = await getRooms({ userId: providerId });
        if (isEnableModalWaring && rooms.length > 0) {
            setWarningModalVisibility({ isOpen: true, numOfRooms: rooms.length });
            return;
        }

        changeStatus("offline");
    };

    return (
        <>
            <Pressable
                style={statusSelectorVisibility ? styles.statusContainerOn : styles.statusContainer}
                onPress={() => setStatusSelectorVisibility(!statusSelectorVisibility)}>
                <View style={styles.emojiContainer}>
                    <EmojiIcon />
                </View>
                {isEmpty(operatorActive) ? (
                    <Text style={styles.placeholder}>{"Cambia tu estado"}</Text>
                ) : (
                    <Text style={styles.textShow}>{capitalize(operatorActive)}</Text>
                )}
                <View style={styles.downIconContainer}>
                    <DownIcon style={styles.downIcon} />
                </View>
            </Pressable>
            {statusSelectorVisibility ? (
                <View style={styles.selectorStatusContainer}>
                    <Pressable style={styles.buttonConnection1} onPress={() => changeStatus("online")}>
                        <ConnectionIcon style={{ color: colors.connection.online }} />
                        <View style={styles.statusOptionContainer}>
                            <Text style={{ color: colors.connection.online }}>Online</Text>
                            <Text style={styles.statusDescription}>Estarás activo, recibirás notificaciones y chats en tu bandeja de entrada.</Text>
                        </View>
                        <RadioButton borderColor={colors.connection.online} selected={isSelected === "online"} />
                    </Pressable>
                    <Pressable style={styles.buttonConnection1} onPress={() => changeStatus("busy")}>
                        <ConnectionIcon style={{ color: colors.connection.busy }} />
                        <View style={styles.statusOptionContainer}>
                            <Text style={{ color: colors.connection.busy }}>No disponible</Text>
                            <Text style={styles.statusDescription}>No recibirás notificaciones ni chats nuevos en tu bandeja de entrada.</Text>
                        </View>
                        <RadioButton borderColor={colors.connection.busy} selected={isSelected === "busy"} />
                    </Pressable>
                    <Pressable style={styles.buttonConnection2} onPress={() => handleLogOut("offline")}>
                        <ConnectionIcon style={{ color: colors.connection.offline }} />
                        <View style={styles.statusOptionContainer}>
                            <Text style={{ color: colors.connection.offline }}>Desconectado</Text>
                            <Text style={styles.statusDescription}>No recibirás notificaciones ni chats nuevos en tu bandeja de entrada.</Text>
                        </View>
                        <RadioButton borderColor={colors.connection.offline} selected={isSelected === "offline"} />
                    </Pressable>
                </View>
            ) : null}
            <WarningModal
                warningModalVisibility={warningModalVisibility}
                setWarningModalVisibility={setWarningModalVisibility}
                isForceNotLogOut={isForceNotLogOut}
                changeStatusToOffline={changeStatus}
            />
        </>
    );
};

export default ProfileStatus;

const styles = StyleSheet.create({
    statusContainer: {
        flexDirection: "row",
        marginTop: 26,
        borderColor: colors.gray.outline,
        borderWidth: 1,
        borderRadius: 10,
        alignItems: "center",
        padding: 10,
        position: "relative",
    },
    statusContainerOn: {
        flexDirection: "row",
        marginTop: 26,
        borderColor: colors.primary[500],
        borderWidth: 1,
        borderRadius: 10,
        alignItems: "center",
        padding: 10,
        position: "relative",
    },
    emojiContainer: { marginRight: 10 },
    placeholder: { color: colors.gray[200] },
    textShow: { color: colors.text.primary, fontSize: 13 },
    downIconContainer: { position: "absolute", right: 8 },
    downIcon: { color: colors.secondary[100] },
    selectorStatusContainer: {
        flexDirection: "column",
        borderBottomEndRadius: 18,
        borderBottomLeftRadius: 18,
        borderTopColor: "transparent",
        marginTop: 5,
        backgroundColor: colors.white,
        shadowOffset: {
            width: 2,
            height: 6,
        },
        shadowRadius: 10,
        shadowOpacity: 0.2,
        shadowColor: "#000000",
    },
    statusOptionContainer: { paddingHorizontal: 12, width: "85%" },
    statusDescription: { color: colors.default, fontSize: 12, marginTop: 6 },
    buttonConnection1: {
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: colors.gray.outline,
        borderBottomWidth: 1,
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    buttonConnection2: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
});
