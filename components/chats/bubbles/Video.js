import { StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import { ResizeMode } from "expo-av";
import { Video } from "expo-av";
import Lightbox from "react-native-lightbox-v2";
import { get } from "lodash";
import colors from "../../../constants/colors";

const VideoBubble = (props) => {
    const { message, parentBubbleStyle, footerBubble, headerBubble } = props;
    const mediaUrl = get(message, "mediaUrl", "");
    const video = useRef(null);

    return (
        <View style={parentBubbleStyle}>
            {headerBubble()}
            <Lightbox
                activeProps={{
                    style: styles.videoActive,
                }}>
                <Video
                    ref={video}
                    style={styles.video}
                    source={{
                        uri: mediaUrl,
                    }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    onPlaybackStatusUpdate={(status) => console.log(status)}
                />
            </Lightbox>
            {footerBubble()}
        </View>
    );
};

export default VideoBubble;

const styles = StyleSheet.create({
    video: { width: 150, height: 250, borderRadius: 8, margin: 3 },
    videoActive: {
        flex: 1,
        resizeMode: "contain",
        padding: 5,
        backgroundColor: colors.primary[100],
    },
});
