import React from "react";
import { StyleSheet, View, Text } from "react-native";
import colors from "../../constants/colors";
import sizes from "../../constants/sizes";
import { isEmpty } from "lodash";

const ProfileListItem = ({ item }) => {
    if (isEmpty(item.body)) return;
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={[styles.body, { color: item.id === "username" ? colors.semantic.info : colors.gray[200] }]}>{item.body}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: sizes.fontLarge,
        fontWeight: "600",
        color: colors.secondary[100],
    },
    body: {
        paddingTop: 8,
        fontSize: sizes.fontLarge,
        fontWeight: "600",
    },
});

export default ProfileListItem;
