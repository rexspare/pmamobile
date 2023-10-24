import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Keyboard, Image, Dimensions, KeyboardAvoidingView, SafeAreaView, Platform } from "react-native";
import SignInForm from "../components/SignInForm";
import margins from "../constants/margins";
import colors from "../constants/colors";
import sizes from "../constants/sizes";

const JelouLogo = require("../assets/icons/JelouSmallBlueLogo.png");
const WavingHand = require("../assets/icons/WavingHandIcon.png");

const { width } = Dimensions.get("window");

const SignInScreen = ({ navigation }) => {
    const [keyboardOpen, setKeyboardOpen] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
            setKeyboardOpen(true); // or some other action
        });
        const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardOpen(false); // or some other action
        });
        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                <View style={{ ...styles.inner, paddingVertical: Platform.OS === "ios" ? 10 : 80 }}>
                    {/* {errorModal(errors)} */}
                    <Image style={styles.jelouLogo} source={JelouLogo} />
                    {!keyboardOpen && <Image style={styles.wavingHand} source={WavingHand} />}
                    <Text style={styles.header}>Panel Multiagente</Text>
                    <SignInForm errors={errors} setErrors={setErrors} keyboardOpen={keyboardOpen} setKeyboardOpen={setKeyboardOpen} />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    inner: {
        flex: 1,
        paddingHorizontal: margins.screenHorizontal,
        backgroundColor: colors.white,
    },
    screen: {
        flex: 1,
    },
    jelouLogo: {
        width: 70,
        height: 18,
    },
    wavingHand: {
        width: 42,
        height: 42,
        marginTop: width * 0.3,
    },
    header: {
        fontWeight: "bold",
        color: colors.primary[500],
        marginTop: 10,
        marginBottom: 15,
        fontSize: sizes.fontHeader,
    },
});

export default SignInScreen;
