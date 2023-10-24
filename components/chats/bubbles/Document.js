import React from "react";
import { FileIcon } from "react-file-icon";
import { StyleSheet, Text, View } from "react-native";
import colors from "../../../constants/colors";
import { MaterialIcons, Ionicons, AntDesign } from "@expo/vector-icons";
import { get, isEmpty, last, toUpper, truncate } from "lodash";
import { USER_TYPES } from "../../../constants/constants";

const DocumentBubble = (props) => {
    const { parentBubbleStyle, message, footerBubble, headerBubble, by } = props;
    const mediaUrl = get(message, "mediaUrl", "");

    const getExtention = (url) => {
        try {
            return last(url.split("."));
        } catch (error) {
            if (message.caption) {
                let file = message.caption.split(".");
                return last(file);
            }
            return "Unknown";
        }
    };
    const extension = getExtention(mediaUrl);

    const setLabelColor = (type) => {
        switch (toUpper(type)) {
            case "PDF":
                return "#F15642";
            case "DOC":
                return "#2A8BF2";
            case "DOCX":
                return "#2A8BF2";
            case "PPT":
                return "#D14423";
            case "PPTX":
                return "#D14423";
            case "XLS":
                return "#1A754C";
            case "XLSX":
                return "#1A754C";
            default:
                return "#F15642";
        }
    };

    const getName = (fileName, mediaUrl) => {
        let file = fileName;

        if (isEmpty(file)) {
            let media = mediaUrl.split("/");
            file = last(media);
        }

        const name = getExtention(file);
        return truncate(file.replace(`.${name}`, ""), 10);
    };

    const getFileIcon = (extension) => {
        switch (toUpper(extension)) {
            case "PDF":
                return <MaterialIcons name="picture-as-pdf" size={40} color={setLabelColor(extension)} />;
            case "DOC":
                return <Ionicons name="document" size={40} color={setLabelColor(extension)} />;
            case "PPT":
                return <AntDesign name="pptfile1" size={40} color={setLabelColor(extension)} />;
            default:
                return <Ionicons name="document" size={40} color={setLabelColor(extension)} />;
        }
    };

    return (
        <View style={parentBubbleStyle}>
            {headerBubble()}
            <View style={by === USER_TYPES.USER ? styles.containerDocumentUser : styles.containerDocumentOperator}>
                {getFileIcon(extension)}
                <Text style={styles.textName}> {getName(get(message, "filename", message.caption) || "", get(message, "mediaUrl", "/"))}</Text>
                <Ionicons name="download-outline" size={28} color={colors.default} />
            </View>
            {footerBubble()}
        </View>
    );
};

const styles = StyleSheet.create({
    textName: {
        fontSize: 11,
        width: "60%",
        color: colors.default,
        fontFamily: "regular",
        paddingHorizontal: 8,
    },
    containerDocumentUser: {
        backgroundColor: "rgba(114,124,148,0.1)",
        marginVertical: 8,
        padding: 10,
        borderRadius: 6,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
    containerDocumentOperator: {
        backgroundColor: "rgba(0,179,199,0.15)",
        marginVertical: 8,
        padding: 10,
        borderRadius: 6,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
    },
});

export default DocumentBubble;
