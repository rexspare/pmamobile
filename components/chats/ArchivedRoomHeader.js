import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import colors from "../../constants/colors";
import DownIcon from "../icons/DownIcon";
import SourceType from "../common/SourceType";
import ContactIcon from "../icons/ContactIcon";
import CloseIcon from "../icons/CloseIcon";
import { getName } from "../../utils/helpers";
import ContactModal from "../modals/ContactModal";

const ArchivedRoomHeader = (props) => {
    const { room = {}, navigation } = props;
    const { room: roomInfo = {}, user } = room;
    const name = getName(roomInfo, user);
    const { sidebarData = {} } = roomInfo;
    const legalId = get(sidebarData, "cedula", get(sidebarData, "legalId", ""));
    const botType = get(room, "bot.type", "");

    const [contactModalVisibility, setContactModalVisibility] = useState(false);

    const openContactModal = () => {
        setContactModalVisibility(true);
    };

    return (
        <View style={styles.headerContainer}>
            <Pressable style={styles.iconRotate} onPress={() => navigation.goBack()}>
                <DownIcon style={styles.downIcon} />
            </Pressable>
            <View style={styles.infoHeader}>
                <SourceType source={botType} />
                <View style={styles.textInfoHeader}>
                    <Text numberOfLines={1} style={styles.textName}>
                        {name}
                    </Text>
                    {!isEmpty(legalId) ? (
                        <Text numberOfLines={1} style={styles.legalIdText}>
                            {legalId}
                        </Text>
                    ) : null}
                </View>
            </View>
            <View style={styles.buttonsContainer}>
                <Pressable style={styles.ContactIcon} onPress={openContactModal}>
                    <ContactIcon />
                    <Text style={styles.contactText}>Contactar</Text>
                </Pressable>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <CloseIcon />
                </TouchableOpacity>
            </View>
            <ContactModal
                room={room}
                name={name}
                contactModalVisibility={contactModalVisibility}
                setContactModalVisibility={setContactModalVisibility}
                {...props}
            />
        </View>
    );
};

export default ArchivedRoomHeader;

const styles = StyleSheet.create({
    headerContainer: {
        height: 80,
        backgroundColor: colors.white,
        borderBottomColor: colors.gray.outline,
        borderBottomWidth: 0.5,
        //marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    iconRotate: { transform: [{ rotate: "90deg" }], backgroundColor: "transparent", alignItems: "center" },
    downIcon: { color: colors.text.primary, width: 22, height: 22 },
    infoHeader: { flexDirection: "row", marginLeft: 10, alignItems: "center", flex: 4 },
    textInfoHeader: { flexDirection: "column", marginLeft: 6, justifyContent: "space-evenly" },
    textName: { fontSize: 14, fontWeight: "700", color: colors.text.primary },
    legalIdText: { fontSize: 12, fontWeight: "400", color: colors.default, marginVertical: 4 },
    buttonsContainer: {
        flexDirection: "row",
        marginLeft: 10,
        backgroundColor: "transparent",
        flex: 4,
        justifyContent: "space-around",
        alignItems: "center",
    },
    ContactIcon: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: colors.primary[500],
    },
    contactText: { color: colors.primary[500], fontSize: 14 },
});
