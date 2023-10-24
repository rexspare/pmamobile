import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";
import colors from "../constants/colors";
import LogOutIcon from "../components/icons/LogOutIcon";
import CloseIcon from "../components/icons/CloseIcon";
import ProfileAvatar from "../components/common/ProfileAvatar";
import ProfilePreferences from "../components/Profile/ProfilePreferences";
import ProfileConfiguration from "../components/Profile/ProfileConfiguration";
import { operatorStatusColor } from "../utils/helpers";
import HeaderIcon from "../components/chats/HeaderIcon";
import ProfileStatus from "../components/Profile/ProfileStatus";
import DashboardServer from "../api/DashboardServer";
import { setIsLogged } from "../reducers/login";
import { unsetCompany } from "../reducers/company";
import { unsetTeams } from "../reducers/teams";

const ProfileScreen = (props) => {
    const { navigation } = props;
    const userSession = useSelector((state) => state.userSession);
    const company = useSelector((state) => state.company);
    const { names, email, operatorActive, sessionId } = userSession;
    const color = operatorStatusColor(operatorActive);
    const status = { fontSize: 14, fontWeight: "500", color, marginTop: 6 };
    const dispatch = useDispatch();

    const queryClient = useQueryClient();

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <HeaderIcon navigation={navigation} />,
        });
    }, [navigation]);

    const logOut = async () => {
        await DashboardServer.post("/auth/logout", {
            sessionId,
            logoutOperator: true,
        }).then(async (response) => {
            dispatch(setIsLogged(false));
            queryClient.clear();
            dispatch(unsetTeams());
            dispatch(unsetCompany());
            await AsyncStorage.removeItem("@bearerToken");
            await AsyncStorage.removeItem("@refreshToken");
            await AsyncStorage.removeItem("session");
        });
    };

    return (
        <ScrollView style={styles.container}>
            <Pressable onPress={() => navigation.navigate("Home")}>
                <CloseIcon />
            </Pressable>
            <Text style={styles.myProfileText}>Mi perfil</Text>
            <View style={styles.infoContainer}>
                <ProfileAvatar names={names} backgroundColor="#d2b1fc" size={60} textColor="#fff" borderColor={color} backgroundColorBullet={color} />
                <View style={styles.textInfoContainer}>
                    <Text style={styles.names}>{names}</Text>
                    <Text style={styles.email}>{email}</Text>
                    <Text style={status}>{operatorActive}</Text>
                </View>
            </View>
            <ProfileStatus operator={userSession} company={company} />
            <View style={styles.line} />
            {/* <ProfilePreferences /> */}
            {/* <ProfileConfiguration /> */}
            <Pressable style={styles.logOutContainer} onPress={logOut}>
                <LogOutIcon />
                <Text style={styles.logOutText}>Cerrar Sesión</Text>
            </Pressable>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: colors.white,
        padding: "4%",
    },
    myProfileText: { fontSize: 18, fontWeight: "600", color: colors.primary[500], marginVertical: 10 },
    infoContainer: { flexDirection: "row", marginTop: 16 },
    textHeader: { fontSize: 16, fontWeight: "600", color: colors.primary[500], marginVertical: 10 },
    textInfoContainer: { flexDirection: "column", marginHorizontal: 16 },
    names: { fontSize: 14, fontWeight: "500", color: colors.secondary[100] },
    email: { fontSize: 12, fontWeight: "400", color: colors.gray[200], marginTop: 6 },
    logOutContainer: { flexDirection: "row", alignItems: "center", marginTop: 16 },
    logOutText: { color: colors.red[200], marginLeft: 10 },
    line: {
        borderBottomColor: colors.gray.outline,
        borderBottomWidth: 0.8,
        marginBottom: 10,
        marginTop: 14,
    },
});

export default ProfileScreen;
