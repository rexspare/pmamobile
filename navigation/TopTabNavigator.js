import { StyleSheet } from "react-native";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ShowTabTitle from "../components/chats/ShowTabTitle";
import ActiveRoomScreen from "../screens/ActiveRoomScreen";
import UnreadScreen from "../screens/UnreadScreen";
import colors from "../constants/colors";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { ROOM_TYPES } from "../constants/constants";

const Tab = createMaterialTopTabNavigator();

const TopTabNavigator = (props) => {
    const { isLoadingRooms } = props;
    const userSession = useSelector((state) => state.userSession);
    const queryClient = useQueryClient();
    const rooms = queryClient.getQueryData({ queryKey: ["rooms", ROOM_TYPES.CLIENT] }) || [];
    const { providerId } = userSession;

    const unreadRooms = rooms.filter((room) => room.membersMetaInfo[providerId].unreadMessages > 0);

    return (
        <Tab.Navigator
            initialRouteName="Activo"
            screenOptions={{
                tabBarLabelStyle: styles.topNavigatorLabel,
                tabBarStyle: styles.topNavigatorStyle,
                tabBarIndicatorStyle: styles.topNavigatorIndicatorStyle,
                swipeEnabled: false,
            }}>
            <Tab.Screen name="Activo" options={{ title: (props) => <ShowTabTitle {...props} roomLength={rooms.length} name="Activo" /> }}>
                {(props) => <ActiveRoomScreen {...props} isLoadingRooms={isLoadingRooms} userSession={userSession} />}
            </Tab.Screen>
            <Tab.Screen name="No leido" options={{ title: (props) => <ShowTabTitle {...props} roomLength={unreadRooms.length} name="Unread" /> }}>
                {(props) => <UnreadScreen {...props} isLoadingRooms={isLoadingRooms} userSession={userSession} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    topNavigatorLabel: { fontSize: 10, textTransform: "capitalize" },
    topNavigatorStyle: { backgroundColor: colors.white },
    topNavigatorIndicatorStyle: { backgroundColor: colors.primary[500] },
});

export default TopTabNavigator;
