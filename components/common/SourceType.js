import { View, StyleSheet } from "react-native";
import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BOT_TYPES } from "../../constants/constants";

const SourceType = (props) => {
    const { source = "gupshup" } = props;
    const type = source.toUpperCase();

    switch (type) {
        case BOT_TYPES.TWILIO:
        case BOT_TYPES.WAVY:
        case BOT_TYPES.SMOOCH:
        case BOT_TYPES.GUPSHUP:
        case BOT_TYPES.WHATSAPP:
        case BOT_TYPES.VENOM:
            return (
                <View style={{ ...styles.viewContainer, ...styles.whatsapp }}>
                    <FontAwesome name="whatsapp" size={24} color="white" />
                </View>
            );
        case BOT_TYPES.FACEBOOK:
        case BOT_TYPES.FACEBOOK_FEED:
            return (
                <View style={{ ...styles.viewContainer, ...styles.facebook }}>
                    <FontAwesome name="facebook-f" size={24} color="white" />
                </View>
            );
        case BOT_TYPES.WEB:
        case BOT_TYPES.APP:
            return (
                <View style={{ ...styles.viewContainer, ...styles.web }}>
                    <MaterialCommunityIcons name="web" size={24} color="white" />
                </View>
            );
        case BOT_TYPES.TWITTER:
            return (
                <View style={{ ...styles.viewContainer, ...styles.twitter }}>
                    <AntDesign name="twitter" size={22} color="white" />
                </View>
            );
        case BOT_TYPES.WIDGET:
            return (
                <View style={{ ...styles.viewContainer, ...styles.widget }}>
                    <MaterialIcons name="phone-iphone" size={24} color="white" />
                </View>
            );
        case BOT_TYPES.INSTAGRAM:
            return (
                <View style={{ ...styles.viewContainer, ...styles.instagram }}>
                    <LinearGradient
                        style={{ ...styles.viewContainer, ...styles.instagram }}
                        colors={["#fdf497", "#fd5949", "#d6249f", "#285AEB"]}
                        end={{ x: 0.1, y: 0.9 }}>
                        <AntDesign name="instagram" size={24} color="white" />
                    </LinearGradient>
                </View>
            );
        default:
            return (
                <View style={{ ...styles.viewContainer, ...styles.web }}>
                    <MaterialCommunityIcons name="web" size={24} color="white" />
                </View>
            );
    }
};

const styles = StyleSheet.create({
    viewContainer: {
        padding: 5,
        marginRight: 5,
        borderRadius: 50,
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    web: {
        backgroundColor: "#B83964",
    },
    whatsapp: {
        backgroundColor: "#25D366",
    },
    facebook: {
        backgroundColor: "#3b5998",
    },
    twitter: {
        backgroundColor: "#00acee",
    },
    instagram: {
        backgroundColor: "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
    },
    widget: {
        backgroundColor: "#00acee",
    },
});

export default SourceType;
