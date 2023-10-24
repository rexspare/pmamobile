import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableHighlight, ActivityIndicator } from "react-native";
import { postStoredParams } from "../../api/entities/bots";
import SidebarElement from "./crmSidebarElement";
import colors from "../../constants/colors";
import { get, isEmpty, toLower } from "lodash";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import { useQueryClient } from "@tanstack/react-query";
import { ROOM_TYPES } from "../../constants/constants";
import { mergeById } from "../../utils/helpers";

const SidebarForm = (props) => {
    const { sidebarSettings, storedParams, roomInfo, verifyStatus, sidebarChanged, setStoredParams } = props;

    const allowSubmitStoredParams = !sidebarChanged?.paramsChanged && verifyStatus?.status;
    const queryClient = useQueryClient();
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const handleSubmit = async () => {
        try {
            setLoadingSubmit(true);
            const { appId: botId, senderId: userId, id } = roomInfo || { id: " " };
            const keyObj = Object.keys(storedParams);

            let trimParams = {};
            keyObj.forEach((key) => {
                if (typeof storedParams[key] === "string") {
                    if (toLower(key) === "name" || toLower(key) === "names" || toLower(key) === "fullname") {
                        updateName(storedParams[key].trim());
                    }
                    trimParams = { ...trimParams, [key]: storedParams[key].trim() };
                } else {
                    trimParams = { ...trimParams, [key]: storedParams[key] };
                }
            });

            const { data: userData = {} } = await postStoredParams({ botId, userId, trimParams });

            queryClient.setQueryData(["rooms", ROOM_TYPES.CLIENT], (oldRooms) => {
                const update = (oldRooms) => {
                    const room = oldRooms.find((room) => get(room, "id") === id);
                    const updatedRoom = !isEmpty(room)
                        ? {
                              ...room,
                              sidebarData: userData,
                          }
                        : room;
                    const mergedRooms = mergeById(oldRooms, updatedRoom);
                    return mergedRooms;
                };
                return update(oldRooms);
            });
            queryClient.setQueryData(["storedParams", botId, userId], () => {
                return { ...userData };
            });
            // showToast("Datos guardados correctamente");
            setLoadingSubmit(false);
        } catch (error) {
            setLoadingSubmit(false);
            console.error(error);
        }
    };

    const handleChange = (name, value) => {
        setStoredParams((prevParams) => ({
            ...prevParams,
            [name]: value,
        }));
    };

    const renderForm = ({ item }) => {
        if (!item || !item.rules) { 
            return null; 
        }
        return (
            <View key={item.id} style={styles.renderParams}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{item.label}</Text>
                    {item.rules && item.rules.isObligatory ? <Text style={styles.required}>*</Text> : null}
                </View>
                <SidebarElement element={item} value={storedParams[item.name]} onChange={handleChange} />
            </View>
        );
    };

    return (
        <>
            <KeyboardAwareFlatList data={sidebarSettings} keyExtractor={(item) => item.id} renderItem={renderForm} />
            <View style={styles.line} />
            <TouchableHighlight
                underlayColor={colors.primary[300]}
                style={!allowSubmitStoredParams ? styles.buttonDisabled : styles.button}
                onPress={!allowSubmitStoredParams || loadingSubmit ? null : handleSubmit}>
                {loadingSubmit ? (
                    <ActivityIndicator color={"white"} style={styles.loading} />
                ) : (
                    <Text style={!allowSubmitStoredParams ? styles.disabledText : styles.text}>Guardar</Text>
                )}
            </TouchableHighlight>
        </>
    );
};

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: "row",
        marginVertical: 10,
        marginBottom: 4,
    },
    title: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.default,
        textTransform: "capitalize",
    },
    required: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.red[200],
        marginHorizontal: 4,
    },
    buttonDisabled: {
        backgroundColor: colors.gray[50],
        borderRadius: 25,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        margin: 16,
        marginBottom: 32,
    },
    button: {
        backgroundColor: colors.primary[500],
        borderRadius: 25,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        margin: 16,
        marginBottom: 32,
    },
    disabledText: { color: colors.default, fontWeight: "500", paddingHorizontal: 20, paddingVertical: 10 },
    text: { color: colors.white, fontWeight: "500", paddingHorizontal: 20, paddingVertical: 10 },
    renderParams: { marginHorizontal: 20, marginVertical: 10 },
    line: { width: "100%", backgroundColor: colors.gray.outline, height: 0.5 },
    loading: {
        alignSelf: "center",
        color: colors.primary[500],
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
});

export default SidebarForm;
