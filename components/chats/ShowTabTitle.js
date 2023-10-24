import { View, Text, StyleSheet } from "react-native";
import React from "react";
import colors from "../../constants/colors";

const ShowTabTitle = (props) => {
    const { name, focused, roomLength } = props;
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{name}</Text>
            <View style={focused ? styles.badgeFocusedWrapper : styles.badgeUnfocusedWrapper}>
                <Text adjustsFontSizeToFit={true} style={focused ? styles.badgeFocused : styles.badgeUnfocused}>
                    {roomLength}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        marginRight: 5,
    },
    badgeFocusedWrapper: {
        backgroundColor: colors.primary[500],
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
        width: 30,
        height: 30,
    },
    badgeUnfocusedWrapper: {
        backgroundColor: colors.primary[100],
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
        width: 30,
        height: 30,
    },
    badgeFocused: {
        color: colors.white,
        textAlign: "center",
        textAlignVertical: "center",
    },
    badgeUnfocused: {
        color: colors.primary[500],
        textAlign: "center",
        textAlignVertical: "center",
    },
});

export default ShowTabTitle;
