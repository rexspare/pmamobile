/* eslint-disable no-console */
import { Pressable, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { get, includes, isEmpty, orderBy } from "lodash";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import colors from "../../constants/colors";
import SearchIcon from "../icons/SearchIcon";
import CloseIcon from "../icons/CloseIcon";
import { useOperators } from "../../api/query/useOperators";
import { useRefreshOnFocus } from "../../hooks/useRefreshOnFocus";
import { transferConversation } from "../../api/entities/conversation";
import { getName } from "../../utils/helpers"; 
import ToastNotification from "../common/ToastNotification";
//import Toast from "react-native-toast-message";

const TransferModal = (props) => {
    const { bot, room, bottomSheetModalRef } = props;
    const userSession = useSelector((state) => state.userSession);
    const company = useSelector((state) => state.company);
    const teams = useSelector((state) => state.teams);
    const [selectedToTransfer, setSelectedToTransfer] = useState({});
    const [queryOperator, setQueryOperator] = useState("");
    const disabled = !!isEmpty(selectedToTransfer);
    const [showToast, setShowToast] = useState(false);
    const nameRoom = getName(room);

    const byScope = get(bot, "properties.operatorView.hasTeamAssignationScope")
        ? get(bot, "properties.operatorView.hasTeamAssignationScope")
        : get(company, "properties.operatorView.hasTeamAssignationScope", false);

    const byTeam = get(bot, "properties.operatorView.byTeam")
        ? get(bot, "properties.operatorView.byTeam")
        : get(company, "properties.operatorView.byTeam", false);

    const getAllTeams = get(bot, "properties.operatorView.byAllTeams")
        ? get(bot, "properties.operatorView.byAllTeams")
        : get(company, "properties.operatorView.byAllTeams", false);

    const getAllMyTeams = get(bot, "properties.operatorView.transferMyTeams", false);

    const getTeamIdsByScope = () => {
        const teamScopes = get(userSession, "TeamScopes", []);
        return teamScopes.map((scope) => scope.teamId);
    };

    const teamsByScope = getTeamIdsByScope();

    const {
        data: operators = [],
        isLoading: isLoadingOperators,
        refetch: refetchOperators,
    } = useOperators({ active: 1, byScope, teams: teamsByScope, parseOperators: true });

    const closeTransferModal = () => {
        setSelectedToTransfer({});
        bottomSheetModalRef.current?.dismiss();
    };

    const filterOperator = (operators) => {
        const companyId = get(userSession, "companyId", false);
        if (!companyId) {
            return operators;
        }
        return operators.filter((operator) => operator.companyId === companyId);
    };

    const getOptions = () => {
        if (byTeam || getAllTeams || getAllMyTeams) {
            const _teams = teams.filter((result) => result.state === true);

            if (userSession.teams) {
                let filteredTeams;

                if (getAllTeams) {
                    filteredTeams = _teams;
                } else if (getAllMyTeams) {
                    filteredTeams = _teams.filter((team) => includes(userSession.teams, team.id));
                } else {
                    filteredTeams = _teams;
                }

                return filteredTeams;
            }
        } else {
            return filterOperator(operators);
        }
        return null;
    };

    useRefreshOnFocus(refetchOperators);

    const passTo = () => {
        setShowToast({
            showToast: true,
            selectedToTransfer,
        });
        setTimeout(() => {
            closeTransferModal();
            setShowToast(false);
            const { navigation } = props;
            navigation.navigate("Home");
        }, 2000);
    };

    const showToasts = () => {
        closeTransferModal();
        const { navigation } = props;
        navigation.navigate("Home");

        Toast.success(`Has transferido el caso de ${nameRoom} al operador ${selectedToTransfer.names} exitosamente.`);
    };

    // const Toast2 = () => {
    //     closeTransferModal();
    //     const { navigation } = props;
    //     navigation.navigate("Home");
    //     Toast.show({
    //         type: "success",
    //         position: "top",
    //         text1: `Has transferido el caso de ${nameRoom} al operador ${selectedToTransfer.names} exitosamente.`,
    //         visibilityTime: 3000,
    //         autoHide: true,
    //         bottomOffset: 30,
    //         textStyle: {
    //           fontSize: 14,
    //         },
    //       });
    //     };

    const transferTo = async () => {
        const { senderId: userId, appId: botId } = room;
        const { value, label } = selectedToTransfer;

        const payload = {
            botId,
            userId,
            ...(byTeam || getAllTeams ? { teamId: value } : { operatorId: value }),
        };

        await transferConversation(payload)
            .then(({ data }) => {
                const type = get(data, "data.type", "");
                if (type === "OPERATOR_NOT_FOUND") {
                    console.log("toast error operator not found label", label);
                } else { 

                    // Muestra una notificación de éxito
                    setShowToast({
                        showToast: true,
                        selectedToTransfer,
                    });
                    setTimeout(() => {
                        closeTransferModal();
                        setShowToast(false);
                        const { navigation } = props;
                        navigation.navigate("Home");
                    }, 2000);
                }
            })
            .catch((error) => {
                console.log("error transfer conversation", error);
            });
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
    const renderEmptyListComponent = () => <Text style={styles.emptyList}>No hay operadores conectados</Text>;

    return (
        <>
            <BottomSheetModal snapPoints={["85%"]} index={0} ref={bottomSheetModalRef} backdropComponent={renderBackdrop}>
                <View style={styles.modalContainer}>
                    <Pressable style={styles.iconContainer} onPress={closeTransferModal}>
                        <CloseIcon />
                    </Pressable>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerText}>Transferir Chat</Text>
                        <Text style={styles.headerTextDescription}>Selecciona y transfiere este caso a otro operador para que pueda resolverlo.</Text>
                        <View style={styles.searchRoom}>
                            <SearchIcon style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Buscar por nombre o ID"
                                value={queryOperator}
                                onChangeText={(text) => {
                                    setQueryOperator(text);
                                }}
                            />
                        </View>
                    </View>
                    <FlatList
                        data={orderBy(getOptions(), ["name"], ["asc"])}
                        renderItem={({ item }) => (
                            <Pressable
                                style={selectedToTransfer.id === item.id ? styles.selectedItem : styles.operatorItem}
                                onPress={() => {
                                    setSelectedToTransfer(item);
                                }}>
                                <Text style={styles.operatorName}>{item.names}</Text>
                                <Text style={styles.operatorTeam}>{item.teamText}</Text>
                            </Pressable>
                        )}
                        ListEmptyComponent={renderEmptyListComponent}
                    />

                    <TouchableHighlight
                        underlayColor={colors.primary[300]}
                        style={disabled ? styles.transferButtonDisabled : styles.transferButton}
                        onPress={disabled ? null : transferTo}> 
                        <Text style={disabled ? styles.transferButtonDisabled.text : styles.transferButton.text}>Transferir</Text>
                        {/* <Text>Transferir</Text> */}
                    </TouchableHighlight>
                </View>
            </BottomSheetModal>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                {showToast && <ToastNotification nameRoom={nameRoom} itemName={showToast.selectedToTransfer.names} />}
            </View>
        </>
    );
};

export default TransferModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        borderRadius: 20,
        backgroundColor: colors.white,
    },
    iconContainer: { flexDirection: "row", justifyContent: "flex-end", margin: 20 },
    headerContainer: { flexDirection: "column", paddingHorizontal: "5%", marginBottom: 10 },
    headerText: { color: colors.secondary[100], fontSize: 18, fontWeight: "600" },
    headerTextDescription: { color: colors.secondary[100], fontSize: 14, marginTop: 16 },
    searchRoom: {
        flexDirection: "row",
        flex: 1,
        borderRadius: 10,
        borderColor: colors.gray.outline,
        borderWidth: 1,
        padding: 20,
        marginRight: 5,
        marginTop: 16,
        alignItems: "center",
    },
    searchIcon: {
        width: 20,
        height: 20,
    },
    searchInput: { flex: 1, marginHorizontal: 12, color: colors.secondary[100], paddingVertical: 10, zIndex: 1 },
    selectedItem: {
        backgroundColor: colors.primary[100],
        flexDirection: "column",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomColor: colors.gray.outline,
        borderBottomWidth: 1,
    },
    operatorItem: {
        flexDirection: "column",
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomColor: colors.gray.outline,
        borderBottomWidth: 1,
    },
    operatorName: { fontSize: 14, fontWeight: "600", color: colors.text.primary },
    operatorTeam: { fontSize: 13, fontWeight: "400", color: colors.text.primary, paddingTop: 4 },
    transferButtonDisabled: {
        backgroundColor: colors.gray[50],
        borderRadius: 25,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        margin: 16,
        marginBottom: 32,
        text: { color: colors.default, fontWeight: "500", paddingHorizontal: 20, paddingVertical: 10 },
    },
    transferButton: {
        backgroundColor: colors.primary[500],
        borderRadius: 25,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        margin: 16,
        marginBottom: 32,
        text: { color: colors.white, fontWeight: "500", paddingHorizontal: 20, paddingVertical: 10 },
    },
    emptyList: { fontSize: 16, textAlign: "center", color: colors.text.primary, fontWeight: "500", marginTop: 20 },

    toastContainer: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 10,
        margin: 20,
        alignItems: "center",
        position: "absolute",
        top: 0,
    },
    toastText: {
        color: "black",
        fontSize: 16,
    },
});
