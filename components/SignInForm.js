import React, { useState, useCallback, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, Image, Pressable, TouchableOpacity, ActivityIndicator, Keyboard } from "react-native";
import { useDispatch } from "react-redux";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import get from "lodash/get";
import { setIsLogged } from "../reducers/login";
import { getUserSession } from "../reducers/userSession";
import DashboardServer from "../api/DashboardServer";
import colors from "../constants/colors";
import sizes from "../constants/sizes";

const CrossedEyeIcon = require("../assets/icons/CrossedEyeIcon.png");
const EyeIcon = require("../assets/icons/EyeIcon.png");

const SignInForm = (props) => {
    const { keyboardOpen, setKeyboardOpen } = props;
    const dispatch = useDispatch();
    const [isPasswordHidden, setIsPasswordHidden] = useState(true);
    const [isInputPressed, setIsInputPressed] = useState({ email: false, password: false });
    const [email, setEmail] = useState(null);
    const [hasEmailError, setHasEmailError] = useState(false);
    const [hasPasswordError, setHasPasswordError] = useState(false);
    const [password, setPassword] = useState(null);
    const [emailMessageError, setEmailMessageError] = useState(false);
    const [passwordMessageError, setPasswordMessageError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isReadyToLogin, setIsReadyToLogin] = useState(false);
    const [hasLoginFailed, setHasLoginFailed] = useState(false);
    const [errors, setErrors] = useState({});

    /** Changes the border of the textInput when the cursor is on it */

    const handlePressIn = useCallback((field) => {
        setIsInputPressed((prevState) => ({
            ...prevState,
            [field]: true,
        }));
    }, []);

    useEffect(() => {
        const correctEmailPattern = /\S+@\S+\.\S+/.test(email);
        if (correctEmailPattern) {
            setHasEmailError(false);
        }
    }, [email]);

    useEffect(() => {
        if (hasEmailError && hasPasswordError) {
            setHasPasswordError(false);
        }
    }, [hasEmailError, hasPasswordError]);

    const handlePressOut = useCallback((field) => {
        setIsInputPressed((prevState) => ({
            ...prevState,
            [field]: false,
        }));
    }, []);

    // listen if the keyboard is open or closed and set a state

    /** Changes password visibility */

    const togglePasswordVisivility = () => {
        setIsPasswordHidden(!isPasswordHidden);
    };

    const validateEmail = (email) => {
        const correctEmailPattern = /\S+@\S+\.\S+/.test(email);
        if (correctEmailPattern) {
            setHasEmailError(false);
        } else {
            setHasEmailError(true);
        }
        return correctEmailPattern;
    };

    useEffect(() => {
        !email && setHasEmailError(false);
        !password && setHasPasswordError(false);
    }, [email, password]);

    /** Logic for user log in */

    const handleLogin = async () => {
        if (!validateEmail(email)) {
            return;
        }
        setLoading(true);
        const dataFormFields = {
            email,
            password,
        };

        try {
            const response = await DashboardServer.post("/auth/login", dataFormFields);
            const { data } = response;
            await AsyncStorage.setItem("@bearerToken", get(data, "data.token", ""));
            await AsyncStorage.setItem("session", get(data, "data.User.sessionId", ""));
            dispatch(setIsLogged(true));
            dispatch(getUserSession());
            setLoading(false);
        } catch (error) {
            console.log("error", error);
            const { response } = error;
            const { data } = response;
            const getErrors = (errorData) => {
                if (!!errorData.validationError) {
                    setHasEmailError(true);
                    setEmailMessageError(get(errorData.validationError.email[0], "es", "El correo no es válido (Default message)"));
                    return;
                }
                if (errorData.message) {
                    setHasPasswordError(true);
                    setPasswordMessageError(get(errorData.error.clientMessages, "es", "La contraseña no es válida (Default message)"));
                }
            };

            setHasLoginFailed(true);
            getErrors(data);
            setLoading(false);
        }
    };

    /** Enables the log in button */
    useEffect(() => {
        if (email && password) setIsReadyToLogin(true);
    }, [email, password]);

    return (
        <View style={styles.container}>
            <View style={styles.inputHeaderContainer}>
                <Text style={styles.inputHeader}>Correo</Text>
                <FontAwesome5 name="question-circle" size={15} color={colors.primary[500]} />
            </View>
            <TextInput
                style={[
                    styles.input,
                    {
                        color: colors.secondary[100],
                        ...(hasEmailError ? { backgroundColor: colors.red[100] } : {}),
                        borderColor: isInputPressed.email ? colors.primary[500] : hasEmailError ? colors.red[200] : colors.gray.outline,
                    },
                ]}
                autoComplete="email"
                inputmode="email"
                placeholder="Escribe tu correo"
                placeholderTextColor={colors.gray[300]}
                onChangeText={(email) => setEmail(email)}
                onFocus={() => {
                    handlePressIn("email");
                    setHasEmailError(false);
                }}
                onBlur={() => handlePressOut("email")}></TextInput>
            {hasEmailError && <Text style={styles.alertText}>{emailMessageError || "El correo no es válido"}</Text>}

            <View style={styles.inputHeaderContainer}>
                <Text style={styles.inputHeader}>Contraseña</Text>
                <FontAwesome5 name="question-circle" size={15} color={colors.primary[500]} />
            </View>
            <View
                style={[
                    styles.input,
                    {
                        flexDirection: "row",
                        gap: 8,
                        color: colors.default,
                        ...(hasEmailError ? { backgroundColor: colors.red[100] } : {}),
                        borderColor: isInputPressed.password ? colors.primary[500] : hasPasswordError ? colors.red[200] : colors.gray.outline,
                    },
                ]}>
                <TextInput
                    style={{ flex: 1, color: isPasswordHidden ? colors.default : colors.secondary[100] }}
                    secureTextEntry={isPasswordHidden}
                    value={password}
                    keyboardType="default"
                    placeholder="Escribe tu contraseña"
                    placeholderTextColor={colors.gray[300]}
                    onChangeText={(password) => setPassword(password)}
                    onFocus={() => {
                        setHasPasswordError(false);
                        handlePressIn("password");
                    }}
                    onBlur={() => handlePressOut("password")}></TextInput>
                {hasPasswordError && <Octicons name="alert" size={17} color={colors.red[300]} />}
                <TouchableOpacity style={{ justifyContent: "center" }} onPress={togglePasswordVisivility}>
                    <Image style={styles.eyeIcon} source={isPasswordHidden ? CrossedEyeIcon : EyeIcon} />
                </TouchableOpacity>
            </View>
            <TouchableOpacity disabled={!isReadyToLogin} onPress={handleLogin}>
                {hasPasswordError && <Text style={styles.alertText}>{passwordMessageError}</Text>}
                <LinearGradient
                    colors={["#00B3C7", "#00A2CF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        styles.button,
                        {
                            cursor: isReadyToLogin ? "pointer" : "not-allowed",
                            marginTop: hasLoginFailed ? 25 : 50,
                        },
                    ]}>
                    <>
                        {loading ? (
                            <ActivityIndicator color={"white"} style={styles.loading} />
                        ) : (
                            <Text style={styles.buttonText}>Iniciar sesión</Text>
                        )}
                    </>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    inputHeaderContainer: {
        flexDirection: "row",
        gap: 4,
        marginTop: 27,
        marginBottom: 4,
    },
    inputHeader: {
        marginLeft: 16,
        fontSize: sizes.fontLarge,
        fontWeight: "700",
        color: colors.default,
    },
    helpIcon: {
        width: 15,
        height: 16,
    },
    input: {
        borderRadius: 9,
        borderWidth: 1,
        borderColor: colors.gray.outline,
        height: sizes.inputHeight,
        paddingHorizontal: sizes.inputHorizontalPadding,
        paddingVertical: sizes.inputVerticalPadding,
    },
    eyeIcon: {
        width: 22,
        height: 18,
        resizeMode: "contain",
    },
    button: {
        height: sizes.buttonLarge,
        borderRadius: 100,
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
    },
    gradient: {
        width: "100%",
        height: "100%",
    },
    buttonText: {
        color: colors.white,
        fontSize: sizes.fontExtraLarge,
        fontWeight: "700",
    },
    alertText: {
        marginTop: 8,
        color: colors.red[200],
    },
    loading: {
        alignSelf: "center",
        color: colors.primary[500],
    },
});

export default SignInForm;
