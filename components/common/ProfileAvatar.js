import { StyleSheet, Text, View } from "react-native";
import React from "react";
import isEmpty from "lodash/isEmpty";

const ProfileAvatar = (props) => {
    const {
        names,
        borderColor,
        size = 60,
        backgroundColor = "#d2b1fc",
        sizeConnectionBullet = 10,
        backgroundColorBullet = "transparent",
        fontSize = 24,
        textColor,
    } = props;

    const containerStyle = {
        borderRadius: 10000,
        width: size,
        height: size,
        backgroundColor,
        borderWidth: 3,
        borderColor,
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    };

    const connectionStatus = {
        borderRadius: 35,
        width: sizeConnectionBullet,
        height: sizeConnectionBullet,
        position: "absolute",
        top: 0,
        backgroundColor: backgroundColorBullet,
        right: 0,
    };

    const textStyle = { color: textColor, fontSize };

    const initials = !isEmpty(names)
        ? names
              .split(" ")
              .map((n) => n[0])
              .join("")
        : "...";

    return (
        <View style={containerStyle}>
            <View style={connectionStatus} />
            <Text style={textStyle}>{initials}</Text>
        </View>
    );
};

export default ProfileAvatar;

const styles = StyleSheet.create({});
