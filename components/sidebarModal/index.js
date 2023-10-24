import React, { useCallback, useEffect } from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { useDispatch } from "react-redux";
import get from "lodash/get";
import { Ionicons } from "@expo/vector-icons";
import { setSidebarChannel } from "../../reducers/sidebarChannel";
import { setTags } from "../../reducers/tags";
import SideBarTapNavigator from "./sidebarTapNavigator";
import colors from "../../constants/colors";
import { useRoomInfo } from "../../api/query/useRoomInfo";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TagScreen from "../../screens/TagScreen";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

const StackNav = (props) => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="SideBarTapNavigator">{() => <SideBarTapNavigator {...props} />}</Stack.Screen>
                <Stack.Screen name="TagScreen" component={TagScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const SidebarModal = (props) => {
    const { room, sidebarSettings, storedParams, setStoredParams, bottomSheetModalRef, isArchived = false, storedParamsData } = props;
    const dispatch = useDispatch();

    const { data: roomInfo } = useRoomInfo({ roomId: room?.id || room?.roomId });

    useEffect(() => {
        dispatch(setTags(get(roomInfo, "tags", [])));
        dispatch(setSidebarChannel(get(roomInfo, "channel", "")));
    }, [roomInfo]);

    const closeModal = () => {
        if (!isArchived) {
            setStoredParams(storedParamsData);
        }
        bottomSheetModalRef.current?.dismiss();
    };

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop
                {...props}
                appearsOnIndex={1}
                animatedIndex={{
                    value: 1,
                }}
            />
        ),
        []
    );

    return (
        <BottomSheetModal snapPoints={["90%"]} index={0} ref={bottomSheetModalRef} backdropComponent={renderBackdrop}>
            <View style={styles.modalContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.header}>Detalles de la conversación</Text>
                    <Pressable style={styles.closeHeader} onPress={closeModal}>
                        <Ionicons name="close" size={24} color={colors.secondary[100]} />
                    </Pressable>
                </View>
                <StackNav
                    roomInfo={roomInfo}
                    sidebarSettings={sidebarSettings}
                    storedParams={storedParams}
                    setStoredParams={setStoredParams}
                    isArchived={isArchived}
                />
            </View>
        </BottomSheetModal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray.outline,
        position: "relative",
    },
    header: {
        flex: 1,
        fontWeight: "700",
        color: colors.secondary[100],
        textAlign: "center",
    },
    closeHeader: { marginRight: 16, position: "absolute", right: 0 },
});
export default SidebarModal;
