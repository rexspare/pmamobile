import { StyleSheet, Text, View } from "react-native";
import React from "react";
import get from "lodash/get";
import isObject from "lodash/isObject";
import toUpper from "lodash/toUpper";
import toLower from "lodash/toLower";
import colors from "../../constants/colors";
import { TYPE_MESSAGE, TYPE_SLUGS } from "../../constants/constants";

const MessagePreview = (props) => {
    const { message = {} } = props;
    const { by } = message;
    const previewMessage = get(message, "message", get(message, "bubble", null));
    const names = get(props, "message.sender.names", "");

    if (!previewMessage) {
        return <Text></Text>;
    }

    if (isObject(previewMessage.text)) {
        return (
            <Text numberOfLines={1} style={styles.messageText}>
                Invalid Message
            </Text>
        );
    }

    const type = get(previewMessage, "type", "");
    const text = get(previewMessage, "text", "");
    const slug = get(previewMessage, "slug");

    const getMessage = () => {
        switch (toUpper(slug)) {
            case TYPE_SLUGS.ASSIGNED:
                return `Asignado a ${names}`;
            case TYPE_SLUGS.TIME_END:
                return `Conversación expirada`;
            case TYPE_SLUGS.REMOVE_USER:
                return `Conversación finalizada`;
            case TYPE_SLUGS.SWITCH_OPERATOR_FROM:
                return `Transferido a ${get(props, "message.eventPayload.operator.names", "")}`;
            default:
                return get(previewMessage, "message.description", get(previewMessage, "bubble.description", "Sin Descripción"));
        }
    };

    const showMessage = () => {
        switch (toUpper(type)) {
            case TYPE_MESSAGE.TEXT:
                return text;
            case TYPE_MESSAGE.EVENT:
                return getMessage();
            case TYPE_MESSAGE.AUDIO:
                return "Audio";
            case TYPE_MESSAGE.IMAGE:
                return "Imagen";
            case TYPE_MESSAGE.VIDEO:
                return "Video";
            case TYPE_MESSAGE.FILE:
            case TYPE_MESSAGE.DOCUMENT:
                return "Documento";
            default:
                if (toUpper(by) === "USER") {
                    return toLower(message.type);
                } else {
                    return toLower(message.type);
                }
        }
    };

    return (
        <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
            <Text numberOfLines={1} style={styles.messageText}>
                {showMessage()}
            </Text>
        </View>
    );
};

export default MessagePreview;

const styles = StyleSheet.create({
    messageText: {
        fontSize: 14,
        fontWeight: "300",
        color: colors.default,
    },
});
