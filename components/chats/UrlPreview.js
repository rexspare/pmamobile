import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from "react-native";
import CloseIcon from "../icons/CloseIcon";
import * as VideoThumbnails from "expo-video-thumbnails";
import { set } from "lodash";

export const UrlPreview = ({ title_link = "titulo", og_scrape_url = "", text = "", mediaUrl, type, title = "Titulo de la imagen" }) => {
    const [loading, setLoading] = useState(false);
    const [thumbUrl, setThumbUrl] = useState(null);
    const generateThumbnail = async () => {
        setLoading(true);
        try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(mediaUrl, {
                time: 15000,
            });
            setThumbUrl(uri);
            setLoading(false);
        } catch (e) {
            console.warn(e);
            setLoading(false);
        }
    };

    if (type === "video") {
        // generateThumbnail();
        setTimeout(() => {
            setLoading(false);
        }, 5000);
    }

    return (
        <View style={styles.container}>
            <View style={{ position: "relative" }}>
                <View style={styles.thumbnailContainer}>
                    <TouchableOpacity>
                        <Image
                            onLoadStart={() => setLoading(true)}
                            onLoadEnd={() => setLoading(false)}
                            // onLoad={() => setLoading(false)}
                            loadingIndicatorSource={{ uri: thumbUrl || mediaUrl }}
                            source={{ uri: thumbUrl || mediaUrl }}
                            style={styles.thumbnail}
                        />
                    </TouchableOpacity>
                    {loading && <ActivityIndicator size="small" color="#fff" style={{ position: "absolute" }} />}
                    <TouchableOpacity style={styles.closeIconContainer}>
                        <CloseIcon width={12} style={{ color: "#fff" }} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingLeft: 10,
        marginLeft: 4,
        marginVertical: 5,
    },
    detailsContainer: {
        flexDirection: "column",
        flex: 6,
    },
    thumbnailContainer: {
        backgroundColor: "#000",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        height: 40,
        width: 40,
    },
    thumbnail: {
        borderRadius: 5,

        height: 40,
        width: 40,
    },
    titleUrl: {
        fontFamily: "Lato-Regular",
        fontWeight: "bold",
        padding: 2,
    },
    closeIconContainer: {
        borderRadius: 100,
        borderColor: "#fff",
        borderWidth: 2,
        flex: 1,
        width: 16,
        height: 16,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        position: "absolute",
        top: -8,
        right: -8,
    },
    title: {
        fontFamily: "Lato-Regular",
        fontWeight: "bold",
        color: "#1E75BE",
        padding: 2,
    },
    description: {
        fontFamily: "Lato-Regular",
        padding: 2,
    },
});
