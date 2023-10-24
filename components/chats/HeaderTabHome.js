import { StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../../constants/colors";

const HeaderTabHome = (props) => {
    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>{props.name}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginLeft: 15,
    },
    headerText: { fontWeight: "600", fontSize: 22, color: colors.primary[500] },
});

export default HeaderTabHome;
