import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import TranslateIcon from "../icons/TranslateIcon";
import ClockIcon from "../icons/ClockIcon";
import DownIcon from "../icons/DownIcon";
import SoundIcon from "../icons/SoundIcon";
import colors from "../../constants/colors";
import { useSelector } from "react-redux";
import SpanishIcon from "../icons/SpanishIcon";

const ProfilePreferences = () => {
    const userSession = useSelector((state) => state.userSession);
    const { lang, timezone } = userSession;

    const showLang = () => {
        if (lang === "en") {
            return (
                <View style={styles.langContainer}>
                    <SpanishIcon />
                    <Text style={styles.textLang}>Inglés</Text>
                </View>
            );
        }
        if (lang === "pt") {
            return (
                <View style={styles.langContainer}>
                    <SpanishIcon />
                    <Text style={styles.textLang}>Portugués</Text>
                </View>
            );
        }
        return (
            <View style={styles.langContainer}>
                <SpanishIcon />
                <Text style={styles.textLang}>Español</Text>
            </View>
        );
    };
    return (
        <>
            <Text style={styles.textHeader}>Preferencias</Text>
            <Pressable style={styles.buttonContainerPreferences}>
                <TranslateIcon />
                <View style={styles.textViewPreferences}>
                    <Text style={styles.textTitlePreferences}>Idioma</Text>
                    {showLang()}
                </View>
                <View style={styles.rightIconContainer}>
                    <DownIcon style={styles.rightIcon} />
                </View>
            </Pressable>
            <Pressable style={styles.buttonContainerPreferences}>
                <ClockIcon />
                <View style={styles.textViewPreferences}>
                    <Text style={styles.textTitlePreferences}>Zona horaria</Text>
                    <Text style={styles.timezoneText}>{timezone}</Text>
                </View>
                <View style={styles.rightIconContainer}>
                    <DownIcon style={styles.rightIcon} />
                </View>
            </Pressable>
            <Pressable style={styles.buttonContainerPreferences}>
                <SoundIcon />
                <Text style={styles.textOption}>Activar Sonido</Text>
            </Pressable>
        </>
    );
};

export default ProfilePreferences;

const styles = StyleSheet.create({
    textHeader: { fontSize: 16, fontWeight: "600", color: colors.primary[500], marginVertical: 10 },
    buttonContainerPreferences: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        borderBottomColor: colors.gray.outline,
        borderBottomWidth: 1,
        position: "relative",
    },
    textViewPreferences: { flexDirection: "column", marginLeft: 12 },
    textTitlePreferences: { fontSize: 12, fontWeight: "300", color: colors.gray[200] },
    rightIconContainer: { transform: [{ rotate: "270deg" }], position: "absolute", right: 5 },
    rightIcon: { color: colors.secondary[100] },
    timezoneText: { fontSize: 12, color: colors.secondary[100], marginTop: 6, marginBottom: 2 },
    langContainer: { flexDirection: "row", marginHorizontal: 4, marginTop: 6, alignItems: "center" },
    textLang: { color: colors.secondary[100], paddingLeft: 10, fontSize: 14 },
    textOption: { fontSize: 14, fontWeight: "300", color: colors.secondary[100], marginLeft: 12 },
});
