import React from "react";
import { StyleSheet, Text } from "react-native";
import colors from "../../constants/colors";
import sizes from "../../constants/sizes";

const SideBarTapTitle = (props) => {
    const { name } = props;
    return <Text style={styles.header}>{name}</Text>;
};

const styles = StyleSheet.create({
    header: {
        fontSize: sizes.fontLarge,
        fontWeight: "700",
        color: colors.secondary[100],
    },
});

export default SideBarTapTitle;
