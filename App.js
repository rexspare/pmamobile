import * as Font from "expo-font";
import { Provider } from "react-redux";
import { StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { MenuProvider } from "react-native-popup-menu";
// import { HoldMenuProvider } from "react-native-hold-menu";
import { RootSiblingParent } from "react-native-root-siblings";
import React, { useCallback, useEffect, useState } from "react";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Store } from "./store/store";
import AppNavigator from "./navigation/AppNavigator";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity,
        },
    },
});
SplashScreen.preventAutoHideAsync();

export default function App() {
    const [appIsLoaded, setAppISLoaded] = useState(false);

    useEffect(() => {
        // Load fonts
        const prepare = async () => {
            try {
                await Font.loadAsync({
                    bold: require("./assets/fonts/Manrope-Bold.ttf"),
                    extraBold: require("./assets/fonts/Manrope-ExtraBold.ttf"),
                    extraLight: require("./assets/fonts/Manrope-ExtraLight.ttf"),
                    light: require("./assets/fonts/Manrope-Light.ttf"),
                    medium: require("./assets/fonts/Manrope-Medium.ttf"),
                    regular: require("./assets/fonts/Manrope-Regular.ttf"),
                    semiBold: require("./assets/fonts/Manrope-SemiBold.ttf"),
                });
            } catch (err) {
                console.log.error();
            } finally {
                setAppISLoaded(true);
            }
        };

        prepare();
    }, []);

    const onLayout = useCallback(async () => {
        if (appIsLoaded) {
            try {
                await SplashScreen.hideAsync();
            } catch (err) {
                console.log("Error on hide splash screen", err);
            }
        }
    }, [appIsLoaded]);

    if (!appIsLoaded) {
        return null;
    }
    return (
        <Provider store={Store}>
            <QueryClientProvider client={queryClient}>
                {/* <HoldMenuProvider> */}
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <BottomSheetModalProvider>
                        <MenuProvider>
                            <SafeAreaProvider style={styles.container} onLayout={onLayout}>
                                <AppNavigator />
                            </SafeAreaProvider>
                        </MenuProvider>
                    </BottomSheetModalProvider>
                </GestureHandlerRootView>
                {/* </HoldMenuProvider> */}
            </QueryClientProvider>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    label: {
        fontSize: 18,
        fontFamily: "regular",
    },
    tabLogo: { width: 20, height: 20 },
});
