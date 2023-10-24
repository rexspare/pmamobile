import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { get } from "lodash";
import { Image } from "expo-image";

const StickerBubble = (props) => {
    const { message, footerBubble, headerBubble } = props;
    const stickerUrl = get(message, "mediaUrl", "");
    return (
        <>
            {headerBubble()}
            <Image style={styles.stickers} source={stickerUrl} contentFit="cover" />
            {footerBubble()}
        </>
    );
};

export default StickerBubble;

const styles = StyleSheet.create({
    stickers: { width: 100, height: 100, borderRadius: 8, margin: 3, resizeMode: "cover", alignSelf: "center" },
});
