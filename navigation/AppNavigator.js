import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";

import MainNavigator from "./MainNavigator";
import StartUpScreen from "../screens/StartUpScreen";
import SignInScreen from "../screens/SignInScreen";
import { setIsLogged } from "../reducers/login";

import JelouApiV1 from "../api/JelouApiV1";

const AuthStack = createStackNavigator();

const AppNavigator = () => {
    const dispatch = useDispatch();
    const isLogged = useSelector((state) => state.login.isLogged);
    const isAutoLogged = useSelector((state) => state.login.didTryAutoLogin);

    console.log(isAutoLogged, "isAutoLogged");

    const checkAutoLogin = async () => {
        try {
            const token = await AsyncStorage.getItem("@bearerToken");

            JelouApiV1.get("/users/ping").catch((err) => {
                dispatch(setIsLogged(false));
                console.log(err);
            });

            if (token) {
                dispatch(setIsLogged(true));
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        checkAutoLogin();
    }, []);

    return (
        <NavigationContainer>
            {isLogged && <MainNavigator />}
            {!isLogged && !isAutoLogged && <StartUpScreen />}
            {!isLogged && isAutoLogged && (
                <AuthStack.Navigator
                    screenOptions={{
                        headerShown: false,
                    }}>
                    <AuthStack.Screen name="SignIn" component={SignInScreen} />
                </AuthStack.Navigator>
            )}
        </NavigationContainer>
    );
};

export default AppNavigator;
