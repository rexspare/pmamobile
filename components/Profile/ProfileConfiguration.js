import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import UserAdminIcon from "../icons/UserAdminIcon";
import ConfigurationIcon from "../icons/ConfigurationIcon";
import colors from "../../constants/colors";

const ProfileConfiguration = () => {
    return (
        <View style={styles.profileConfig}>
            <Text style={styles.textHeader}>Configuracion</Text>
            <Pressable style={styles.buttonContainerConfig}>
                <UserAdminIcon />
                <Text style={styles.textOption}>Administración de usuarios</Text>
            </Pressable>
            <Pressable style={styles.buttonContainerConfig}>
                <ConfigurationIcon />
                <Text style={styles.textOption}>Configuracion</Text>
            </Pressable>
        </View>
    );
};

export default ProfileConfiguration;

const styles = StyleSheet.create({
    profileConfig: { marginVertical: 10 },
    textHeader: { fontSize: 16, fontWeight: "600", color: colors.primary[500], marginVertical: 10 },
    buttonContainerConfig: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomColor: colors.gray.outline,
        borderBottomWidth: 1,
    },
    textOption: { fontSize: 14, fontWeight: "300", color: colors.secondary[100], marginLeft: 12 },
});
