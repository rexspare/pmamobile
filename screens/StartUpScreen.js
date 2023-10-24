import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet, SafeAreaView, Image, ActivityIndicator, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../constants/colors";
import { setDidTryAutoLogin } from "../reducers/login";

const StartUpScreen = () => {
    const dispatch = useDispatch();
    const isLogged = useSelector((state) => state.login.isLogged);

    const tryLogin = async () => {
        if (!isLogged) {
            dispatch(setDidTryAutoLogin());
        }
    };

    useEffect(() => {
        tryLogin();
    }, []);

    return (
        <LinearGradient
            style={{ flex: 1 }}
            colors={["#0DCADF", colors.primary[500], "#00A2CF"]}
            locations={[0, 0.15, 0.85]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}>
            <SafeAreaView style={styles.container}>
                <Image style={styles.jelouLogo} source={require("../assets/icons/JelouLargeWhiteLogo.png")} />
                <ActivityIndicator {...styles.loading} />
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: colors.primary[500],
    },
    jelouLogo: {
        width: "60%",
        height: undefined,
        aspectRatio: 3.84,
        resizeMode: "contain",
    },
    loading: {
        size: "large",
        color: "#fff",
        marginTop: 20,
    },
});

export default StartUpScreen;
