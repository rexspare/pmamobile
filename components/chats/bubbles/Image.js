import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import Lightbox from "react-native-lightbox-v2";
import colors from "../../../constants/colors";
import { get } from "lodash";

const ImageBubble = (props) => {
    const { message, parentBubbleStyle, footerBubble, headerBubble } = props;
    const mediaUrl = get(message, "mediaUrl", "");

    return (
        <View style={parentBubbleStyle}>
            {headerBubble()}
            <Lightbox
                activeProps={{
                    style: styles.imageActive,
                }}>
                <Image style={styles.image} source={{ uri: mediaUrl }} />
            </Lightbox>
            {footerBubble()}
        </View>
    );
};

export default ImageBubble;

const styles = StyleSheet.create({
    imageActive: {
        flex: 1,
        resizeMode: "contain",
        padding: 5,
        backgroundColor: colors.primary[100],
    },
    image: { width: 150, height: 100, borderRadius: 8, margin: 3, resizeMode: "cover", alignSelf: "center" },
});
