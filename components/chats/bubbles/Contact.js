import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { first, get } from "lodash";
import UserAvatar from "react-native-user-avatar";
import colors from "../../../constants/colors";
import DownIcon from "../../icons/DownIcon";
import { DEFAULT_AVATAR } from "../../../constants/constants";

const ContactBubble = (props) => {
    const { message, parentBubbleStyle, footerBubble, headerBubble } = props;
    const { contacts } = message;

    const contactInfo = first(contacts);
    const name = get(contactInfo, "name", "Desconocido");

    const goToContactInfo = () => {
        props.navigation.navigate("ContactInfoScreen", { contacts });
    };

    let bubbleStyle = { ...parentBubbleStyle, width: "75%" };

    if (contacts.length > 1) {
        const contactLeft = contacts.length - 1;
        const left = contactLeft > 1 ? "contactos mas" : "contacto mas";

        return (
            <TouchableOpacity style={bubbleStyle} onPress={goToContactInfo}>
                {headerBubble()}
                <View style={styles.contactContainer}>
                    <UserAvatar size={36} name={name} src={DEFAULT_AVATAR} bgColor={colors.primary[100]} textColor={colors.primary[500]} />
                    <Text style={styles.contactName}>
                        {name} y {contactLeft} {left}
                    </Text>
                    <View style={styles.iconRotate}>
                        <DownIcon style={styles.downIcon} />
                    </View>
                </View>
                {footerBubble()}
                <View style={styles.contactFooter}>
                    <Text style={styles.viewAll}>Ver todos</Text>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={bubbleStyle} onPress={goToContactInfo}>
            {headerBubble()}
            <View style={styles.contactContainer}>
                <UserAvatar size={36} name={name} src={DEFAULT_AVATAR} bgColor={colors.primary[100]} textColor={colors.primary[500]} />
                <Text style={styles.contactName}>{name}</Text>
                <View style={styles.iconRotate}>
                    <DownIcon style={styles.downIcon} />
                </View>
            </View>
            {footerBubble()}
        </TouchableOpacity>
    );
};

export default ContactBubble;

const styles = StyleSheet.create({
    contactContainer: {
        display: "flex",
        flexDirection: "row",
        marginVertical: 4,
        paddingHorizontal: 3,
        alignItems: "center",
        position: "relative",
    },
    nameContainer: { flexDirection: "row", display: "block", paddingHorizontal: 10 },
    contactName: { color: colors.default, fontSize: 14, fontWeight: "600", flex: 1, width: "90%", paddingLeft: 10, paddingRight: 15, marginRight: 4 },
    iconRotate: { transform: [{ rotate: "270deg" }], position: "absolute", right: 0, top: 0, bottom: 0 },
    downIcon: { color: colors.default },
    contactFooter: { paddingVertical: 6, borderTopColor: colors.gray[300], borderTopWidth: 1 },
    viewAll: { color: colors.default, fontSize: 14, fontWeight: "600", textAlign: "center" },
});
