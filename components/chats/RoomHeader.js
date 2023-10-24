import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRef, useState } from "react";
import DownIcon from "../icons/DownIcon";
import colors from "../../constants/colors";
import SourceType from "../common/SourceType";
import { get, has, isEmpty } from "lodash";
import ManagedIconRoom from "./ManagedIconRoom";
import TransferIcon from "../icons/TransferIcon";
import CloseIcon from "../icons/CloseIcon";
import { getName } from "../../utils/helpers";
import LeaveModal from "../modals/LeaveModal";
import TransferModal from "../modals/TransferModal";
import { useSelector } from "react-redux";

const RoomHeader = (props) => {
    const { room = {}, bot, hasSidebarSettingsEnabled } = props;
    const name = getName(room);
    const { conversation = {}, sidebarData = {} } = room;
    const legalId = get(sidebarData, "cedula", get(sidebarData, "legalId", ""));
    const bottomSheetModalRef = useRef(null);
    const company = useSelector((state) => state.company);

    const [leaveModalVisibility, setLeaveModalVisibility] = useState({ show: false, room: {}, bot: {} });

    const hasPlugin = get(bot, "properties.operatorView.plugin");
    const companyPermission = company.id === 35 ? true : false;
    const sidebarChangedSelector = useSelector((state) => state.sidebarChanged); // this is when changed sidebar you can close conversation
    const verifyStatusSelector = useSelector((state) => state.verifyStatus); // this helps when doing validations for sidebar forms

    const sidebarChanged = sidebarChangedSelector.find((status) => status.roomId === room?.id);
    const verifyStatus = verifyStatusSelector.find((status) => status.roomId === room?.id);

    const sidebarValidations = hasSidebarSettingsEnabled || hasPlugin ? sidebarChanged.paramsChanged && verifyStatus.status : true;

    let canCloseConversation = companyPermission ? companyPermission : sidebarValidations;
    canCloseConversation = has(company, "properties.operatorView.forceClose")
        ? get(company, "properties.operatorView.forceClose", canCloseConversation)
        : companyPermission
        ? companyPermission
        : sidebarValidations;

    const canSwitch = get(bot, "properties.operatorView.canSwitch")
        ? get(bot, "properties.operatorView.canSwitch")
        : get(company, "properties.operatorView.canSwitch", true);

    return (
        <View style={styles.headerContainer}>
            <Pressable style={styles.iconRotate} onPress={() => props.navigation.goBack()}>
                <DownIcon style={styles.downIcon} />
            </Pressable>
            <View style={styles.infoHeader}>
                <SourceType sourceType={room?.channelProvider} />
                <View style={styles.textInfoHeader}>
                    <Text numberOfLines={1} style={styles.textName}>
                        {name}
                    </Text>
                    {!isEmpty(legalId) ? (
                        <Text numberOfLines={1} style={styles.legalIdText}>
                            {legalId}
                        </Text>
                    ) : null}
                    <ManagedIconRoom conversation={conversation} />
                </View>
            </View>
            <View style={styles.buttonsContainer}>
                <Pressable disabled={!canSwitch} onPress={() => bottomSheetModalRef.current?.present()}>
                    <TransferIcon style={styles.transferIcon} />
                </Pressable>
                <Pressable
                    disabled={!canCloseConversation}
                    onPress={() => {
                        setLeaveModalVisibility({ show: true, room, bot });
                    }}>
                    <CloseIcon />
                </Pressable>
            </View>
            <TransferModal bot={bot} room={room} bottomSheetModalRef={bottomSheetModalRef} {...props} />
            <LeaveModal leaveModalVisibility={leaveModalVisibility} setLeaveModalVisibility={setLeaveModalVisibility} {...props} />
        </View>
    );
};

export default RoomHeader;

const styles = StyleSheet.create({
    headerContainer: {
        height: 80,
        backgroundColor: colors.white,
        borderBottomColor: colors.gray.outline,
        borderBottomWidth: 0.5, 
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    iconRotate: { transform: [{ rotate: "90deg" }], flex: 1, backgroundColor: "transparent" },
    downIcon: { color: colors.primary[500], width: 22, height: 22, marginRight: 30 },
    infoHeader: { flexDirection: "row", marginLeft: 10, flex: 8, alignItems: "center" },
    textInfoHeader: { flexDirection: "column", marginLeft: 6, justifyContent: "space-evenly", width: "75%" },
    textName: { fontSize: 14, fontWeight: "700", color: colors.text.primary },
    legalIdText: { fontSize: 12, fontWeight: "400", color: colors.default, marginVertical: 4 },
    buttonsContainer: { flexDirection: "row", marginLeft: 165, flex: 2, backgroundColor: "transparent", justifyContent: "space-between" },
    transferIcon: { color: colors.primary[500], marginRight: 6, marginLeft: 5 },
});