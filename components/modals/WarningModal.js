import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../../constants/colors";
import CloseIcon from "../icons/CloseIcon";
import WarningIcon from "../icons/WarningIcon";

const WarningModal = (props) => {
    const { warningModalVisibility, setWarningModalVisibility, isForceNotLogOut, changeStatusToOffline } = props;

    const closeWarningModal = () => {
        setWarningModalVisibility((prevState) => ({ isOpen: false }));
    };

    const textDescription = isForceNotLogOut
        ? "Recuerda dejar limpia tu bandeja antes de cerrar sesión. Si debes desconectarte, conversa con tu equipo para transferir los casos a otro asesor disponible"
        : "Recuerda dejar limpia tu bandeja antes de cerrar sesión. Si debes desconectarte, conversa con tu equipo para transferir los casos a otro asesor disponible";

    const logOut = () => {
        changeStatusToOffline("offline");
    };

    return (
        <Modal animationType="fade" transparent={true} visible={warningModalVisibility?.isOpen} onRequestClose={closeWarningModal}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Pressable style={styles.iconPosition} onPress={closeWarningModal}>
                        <CloseIcon />
                    </Pressable>
                    <WarningIcon />
                    <View style={styles.headerText}>
                        <Text style={styles.warningText}>
                            Aún tienes <Text style={styles.selectedRoom}>{warningModalVisibility?.numOfRooms} casos abiertos</Text> en tu bandeja
                        </Text>
                    </View>
                    <Text style={styles.simpleText}>{textDescription}</Text>
                    <View style={styles.buttonsContainer}>
                        <Pressable style={styles.goBackButton} onPress={closeWarningModal}>
                            <Text style={styles.goBack}>Volver</Text>
                        </Pressable>
                        <Pressable
                            disabled={isForceNotLogOut}
                            style={isForceNotLogOut ? styles.buttonDisabled : styles.offlineButton}
                            onPress={logOut}>
                            <Text style={isForceNotLogOut ? styles.disabledText : styles.offlineText}>Desconectar</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default WarningModal;

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        flex: 0,
        top: "20%",
        borderRadius: 14,
        padding: 22,
        backgroundColor: colors.white,
        margin: 25,
    },
    iconPosition: { flexDirection: "row", justifyContent: "flex-end" },
    headerText: { marginTop: 24, flexDirection: "row" },
    warningText: { color: colors.yellow[100], fontSize: 18, fontWeight: "400" },
    selectedRoom: { color: colors.yellow[100], fontSize: 18, fontWeight: "600" },
    simpleText: { color: colors.default, marginTop: 20, fontSize: 14 },
    buttonsContainer: {
        flexDirection: "row",
        marginTop: 24,
        justifyContent: "flex-end",
        paddingVertical: 10,
    },
    goBackButton: {
        paddingVertical: 8,
        paddingHorizontal: 22,
        backgroundColor: colors.white,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
    },
    goBack: { color: colors.primary[500], fontWeight: "600" },
    offlineButton: {
        paddingVertical: 8,
        paddingHorizontal: 22,
        backgroundColor: colors.primary[500],
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
    },
    offlineText: { color: colors.white, fontWeight: "600" },
    disabledText: { color: colors.default, fontWeight: "600" },
    buttonDisabled: {
        backgroundColor: colors.gray[50],
        paddingVertical: 8,
        paddingHorizontal: 22,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
    },
});
