import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, Pressable, Animated } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/core";
import { useQueryClient } from "@tanstack/react-query";
import { color } from "react-native-reanimated";
import { registerForPushNotificationsAsync, handleNotification } from "../service/notificationService"; // Import notification functions
import ProfileScreen from "../screens/ProfileScreen";
import ChatListScreen from "../screens/ChatListScreen";
import InboxScreen from "../screens/InboxScreen";
import PostScreen from "../screens/PostScreen";
import RoomScreen from "../screens/RoomScreen";
import colors from "../constants/colors";
import HeaderTabHome from "../components/chats/HeaderTabHome";
import HeaderIcon from "../components/chats/HeaderIcon";
import PmaManagerContext from "../context/PmaManagerContext";
import PmaService from "../service/pmaService";
import { getUserSession } from "../reducers/userSession";
import MessageIcon from "../components/icons/MessageIcon";
import LikeIcon from "../components/icons/LikeIcon";
import InboxIcon from "../components/icons/InboxIcon";
import ContactScreen from "../screens/ContactScreen";
import { getBots } from "../reducers/bots";
import EventListenerLayout from "../context/EventListenerLayout";
import ArchivedChatScreen from "../screens/ArchivedChatScreen";
import ArchivedRoomScreen from "../screens/ArchivedRoomScreen";
import HsmScreen from "../screens/HsmScreen";
import QuickReplyScreen from "../screens/QuickReplyScreen";
import ArchivedIcon from "../components/icons/ArchivedIcon";
import HsmIcon from "../components/icons/HsmIcon";
import SmsIcon from "../components/icons/SmsIcon";
import { ROOM_TYPES } from "../constants/constants";
import UnreadChatListScreen from "../screens/UnreadChatListScreen";
import { useDynamicEvents } from "../api/query/useDynamicEvents";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = ({ navigation }) => {
    const queryClient = useQueryClient();
    const rooms = queryClient.getQueryData({ queryKey: ["rooms", ROOM_TYPES.CLIENT] }) || [];

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <HeaderIcon navigation={navigation} />,
        });
    }, [rooms, navigation]);

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, size, color }) => {
                    switch (route.name) {
                        case "Active":
                            return (
                                <View
                                    style={
                                        focused
                                            ? {
                                                  backgroundColor: colors.primary[100],
                                                  width: 40,
                                                  height: 40,
                                                  borderRadius: 100,
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                              }
                                            : {}
                                    }>
                                    <MessageIcon
                                        style={
                                            focused
                                                ? { width: 20, height: 20, color: colors.primary[500] }
                                                : { width: 20, height: 20, color: colors.secondary[100] }
                                        }
                                    />
                                </View>
                            );
                        case "Unread":
                            return (
                                <View
                                    style={
                                        focused
                                            ? {
                                                  backgroundColor: colors.primary[100],
                                                  width: 40,
                                                  height: 40,
                                                  borderRadius: 100,
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                              }
                                            : {}
                                    }>
                                    <SmsIcon
                                        style={
                                            focused
                                                ? { width: 30, height: 30, color: colors.primary[500] }
                                                : { width: 30, height: 30, color: colors.secondary[100] }
                                        }
                                    />
                                </View>
                            );
                        case "Hsm":
                            return (
                                <View
                                    style={
                                        focused
                                            ? {
                                                  backgroundColor: colors.primary[100],
                                                  width: 40,
                                                  height: 40,
                                                  borderRadius: 100,
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                              }
                                            : {}
                                    }>
                                    <HsmIcon
                                        style={
                                            focused
                                                ? { width: 28, height: 28, color: colors.primary[500] }
                                                : { width: 28, height: 28, color: colors.secondary[100] }
                                        }
                                    />
                                </View>
                            );
                        case "Archived":
                            return (
                                <View
                                    style={
                                        focused
                                            ? {
                                                  backgroundColor: colors.primary[100],
                                                  width: 40,
                                                  height: 40,
                                                  borderRadius: 100,
                                                  alignItems: "center",
                                                  justifyContent: "center",
                                              }
                                            : {}
                                    }>
                                    <ArchivedIcon
                                        style={
                                            focused
                                                ? { width: 26, height: 26, color: colors.primary[500] }
                                                : { width: 26, height: 26, color: colors.secondary[100] }
                                        }
                                    />
                                </View>
                            );
                        default:
                            break;
                    }
                },
                headerShown: false,
                tabBarActiveTintColor: colors.primary[500],
                tabBarInactiveTintColor: colors.secondary[100],
                tabBarLabelStyle: { fontSize: 12, fontWeight: "500" },
                tabBarStyle: {
                    height: 100,
                    alignItems: "center",
                    alignSelf: "center",
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 2,
                },
            })}>
            <Tab.Screen
                name="Active"
                component={ChatListScreen}
                options={({ route }) => ({
                    headerStyle: { height: 100 },
                    tabBarLabel: ({ focused, color }) => {
                        const badgeCount = rooms.length;
                        const formattedBadgeCount = badgeCount < 10 ? `0${badgeCount}` : badgeCount.toString();

                        console.log("BADGECOUNT:", formattedBadgeCount);
                        const badgeStyle = {
                            backgroundColor: focused ? colors.primary[500] : colors.primary[100],
                            color: focused ? "white" : colors.primary[500],
                            fontSize: 12,
                            fontWeight: "bold",
                        };

                        return (
                            <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
                                {badgeCount > 0 && (
                                    <View
                                        style={{
                                            backgroundColor: badgeStyle.backgroundColor,
                                            borderRadius: 80,
                                            paddingHorizontal: 4,
                                            paddingVertical: 2,
                                        }}>
                                        <Text style={{ color: badgeStyle.color, fontSize: badgeStyle.fontSize, fontWeight: badgeStyle.fontWeight }}>
                                            {formattedBadgeCount}
                                        </Text>
                                    </View>
                                )}
                                <Text style={{ color, fontSize: 12, marginRight: 4, fontWeight: "bold", fontStyle: "normal", lineHeight: 16 }}>
                                    Activos
                                </Text>
                            </View>
                        );
                    },
                })}
            />

            {/* <Tab.Screen
                name="Unread"
                component={UnreadChatListScreen}
                options={{
                    tabBarLabel: "No leidos",
                }}
            /> */}
            {/* <Tab.Screen
                name="Hsm"
                component={PostScreen}
                options={{
                    tabBarLabel: "Masivos",
                }}
            /> */}
            <Tab.Screen
                name="Archived"
                component={ArchivedChatScreen}
                options={{
                    tabBarLabel: "Archivados",
                    tabBarLabelStyle: {
                        fontSize: 12,
                        marginBottom: 12,
                        fontWeight: "bold",
                        fontStyle: "normal",
                    },
                }}
            />
        </Tab.Navigator>
    );
};

const MainNavigator = () => {
    const dispatch = useDispatch();
    const [pmaService, setPmaService] = useState(null);
    const userSession = useSelector((state) => state.userSession);
    const company = useSelector((state) => state.company);

    const { data: motivesStatus = [], isLoading } = useDynamicEvents({ companyId: get(company, "id", "") });

    useFocusEffect(
        useCallback(() => {
            if (isEmpty(userSession)) {
                dispatch(getUserSession());
            } else {
                if (!userSession?.isOperator) {
                    return;
                }

                const { id: companyId, socketId: companySocketId } = company;

                const credentials = {
                    names: userSession.names,
                    providerId: userSession.providerId,
                    id: userSession.operatorId,
                };

                const ChatManager = new PmaService({
                    credentials,
                    companyId,
                    companySocketId,
                });

                setPmaService(ChatManager);
            }
        }, [userSession, company])
    );

    useEffect(() => {
        if (isEmpty(company)) return;
        dispatch(getBots());
    }, [company]);

    const [expoPushToken, setExpoPushToken] = useState("");
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        registerForPushNotificationsAsync().then((token) => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            console.log("notification", notification);
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log("==>", response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    const optionScreen = {
        headerTitle: "",
        headerLeft: () => <HeaderTabHome name="Jelou Connect" />,
        headerRight: () => <HeaderIcon />,
        headerStyle: styles.headerStyle,
    };

    return (
        <PmaManagerContext.Provider value={pmaService}>
            <EventListenerLayout />
            <Stack.Navigator>
                <Stack.Screen name="Home" component={TabNavigator} options={optionScreen} />
                <Stack.Screen name="RoomScreen" component={RoomScreen} options={{ headerShown: false }} />
                {/* <Stack.Screen name="ArchivedChatScreen" component={ArchivedChatScreen} options={optionScreen} /> */}
                <Stack.Screen name="ArchivedRoomScreen" component={ArchivedRoomScreen} options={optionScreen} />
                <Stack.Screen
                    name="ContactInfoScreen"
                    component={ContactScreen}
                    options={{
                        headerTitle: "",
                        headerBackTitle: "Back",
                    }}
                />
                {/* <Stack.Screen name="Room" component={RoomScreen} options={optionScreen} /> */}
                <Stack.Screen name="Profile" component={ProfileScreen} options={optionScreen} />
                <Stack.Screen name="HSM" component={HsmScreen} options={optionScreen} />
                <Stack.Screen
                    name="QuickReply"
                    component={QuickReplyScreen}
                    options={{
                        headerTitle: "Plantilla de Mensajes Rapidos",
                        headerTitleStyle: {
                            color: "#011B34",
                            fontSize: 15,
                        },
                    }}
                />
            </Stack.Navigator>
        </PmaManagerContext.Provider>
    );
};

// Can use this function below OR use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(expoPushToken) {
    const message = {
        to: expoPushToken,
        sound: "default",
        title: "Original Title",
        categoryIdentifier: "badge",
        body: "And here is the body!",
        data: { someData: "goes here" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
    });
}

const styles = StyleSheet.create({
    tabLogo: { width: 24, height: 24, color: colors.default },
    tabLogoFocused: { width: 24, height: 24, color: colors.primary[500] },
    headerTab: {
        color: colors.primary[500],
    },
    headerTabBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        color: colors.primary[500],
    },
    headerStyle: {
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,

        elevation: 4,
    },
});

export default MainNavigator;
