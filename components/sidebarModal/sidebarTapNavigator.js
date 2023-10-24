import React from "react";
import { StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SidebarCRM from "./sidebarCrm";
import SidebarProfile from "./sideBarProfile";
import SideBarTapTitle from "./sidebarTapTitle";
import colors from "../../constants/colors";

const Tab = createMaterialTopTabNavigator();

const SideBarTapNavigator = (props) => {
    const { roomInfo, sidebarSettings, storedParams, setStoredParams, isArchived } = props;

    return (
        <Tab.Navigator
            initialRouteName="CRM"
            screenOptions={{
                tabBarIndicatorStyle: styles.selectedTab,
                tabBarStyle: styles.tab,
            }}>
            <Tab.Screen name="CRM" options={{ title: () => <SideBarTapTitle name="CRM" /> }}>
                {(props) => (
                    <SidebarCRM
                        {...props}
                        roomInfo={roomInfo}
                        sidebarSettings={sidebarSettings}
                        storedParams={storedParams}
                        setStoredParams={setStoredParams}
                        isArchived={isArchived}
                    />
                )}
            </Tab.Screen>
            <Tab.Screen name="Profile" options={{ title: () => <SideBarTapTitle name="Perfil" /> }}>
                {(props) => <SidebarProfile {...props} roomInfo={roomInfo} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tab: {
        backgroundColor: colors.white,
    },
    selectedTab: {
        backgroundColor: colors.primary[500],
    },
});

export default SideBarTapNavigator;
