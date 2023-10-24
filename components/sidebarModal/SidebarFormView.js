import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../../constants/colors";
import { get } from "lodash";

const SidebarFormView = (props) => {
    const { sidebarSettings, storedParams } = props;
    const dataArray = Object.entries(storedParams);

    const renderForm = ({ item }) => {
        const getSetting = sidebarSettings.find((setting) => setting.name === item[0]);
        return (
            <View style={styles.renderParams}>
                <Text style={styles.title}>{get(getSetting, "label", item[0])}</Text>
                <Text style={styles.description}>{item[1]}</Text>
            </View>
        );
    };

    return (
        <>
            <FlatList data={dataArray} renderItem={renderForm} />
        </>
    );
};

export default SidebarFormView;

const styles = StyleSheet.create({
    renderParams: { paddingVertical: 10, paddingHorizontal: 20 },
    title: {
        fontSize: 14,
        fontWeight: "600",
        color: colors.secondary[100],
        textTransform: "capitalize",
    },
    description: {
        fontSize: 14,
        paddingTop: 8,
        fontWeight: "600",
        color: colors.gray[200],
    },
});
