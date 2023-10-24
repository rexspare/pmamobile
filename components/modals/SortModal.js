import { Modal, Pressable, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import React, { useCallback } from "react";
import colors from "../../constants/colors";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import Animated from "react-native-reanimated";

const SortModal = (props) => {
    const { sortModalVisible, setSortModalVisibility, setSortOrder, sortOrder, bottomSheetModalRef } = props;

    const closeModal = () => {
        bottomSheetModalRef.current?.dismiss();
        setSortModalVisibility(false);
    };

    const changeSortingOrder = (order) => {
        setSortOrder(order);
        closeModal();
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

    const renderBackground = useCallback((props) => <Animated.View pointerEvents="none" style={{ backgroundColor: "transparent" }} />, []);

    return (
        <BottomSheetModal
            snapPoints={["35%"]}
            index={0}
            ref={bottomSheetModalRef}
            backdropComponent={renderBackdrop}
            backgroundComponent={renderBackground}>
            <View style={styles.overlay}>
                <Pressable
                    style={styles.firstButton}
                    onPress={() => {
                        changeSortingOrder("asc_message");
                    }}>
                    <Text style={sortOrder === "asc_message" ? styles.selectedTextButton : styles.textButton}>Mensajes más recientes</Text>
                </Pressable>
                <Pressable
                    style={styles.middleButton}
                    onPress={() => {
                        changeSortingOrder("desc_message");
                    }}>
                    <Text style={sortOrder === "desc_message" ? styles.selectedTextButton : styles.textButton}>Mensajes más antiguos</Text>
                </Pressable>
                <Pressable
                    style={styles.middleButton}
                    onPress={() => {
                        changeSortingOrder("asc_chat");
                    }}>
                    <Text style={sortOrder === "asc_chat" ? styles.selectedTextButton : styles.textButton}>Chat más recientes</Text>
                </Pressable>
                <Pressable
                    style={styles.endButton}
                    onPress={() => {
                        changeSortingOrder("desc_chat");
                    }}>
                    <Text style={sortOrder === "desc_chat" ? styles.selectedTextButton : styles.textButton}>Chat más antiguos</Text>
                </Pressable>
                <TouchableHighlight underlayColor={colors.primary[300]} style={styles.closeHeader} onPress={closeModal}>
                    <Text style={styles.closeText}>Cancelar</Text>
                </TouchableHighlight>
            </View>
        </BottomSheetModal>
    );
};

export default SortModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        paddingHorizontal: 22,
    },
    firstButton: {
        paddingVertical: 10,
        backgroundColor: colors.white,
        borderTopEndRadius: 12,
        borderTopLeftRadius: 12,
        borderBottomColor: colors.gray.outline,
        borderBottomWidth: 1,
    },
    middleButton: { paddingVertical: 10, backgroundColor: colors.white, borderBottomColor: colors.gray.outline, borderBottomWidth: 1 },
    endButton: { paddingVertical: 10, backgroundColor: colors.white, borderBottomEndRadius: 12, borderBottomLeftRadius: 12 },
    selectedTextButton: { fontSize: 14, color: colors.primary[500], fontWeight: "600", padding: 4, paddingHorizontal: 16 },
    textButton: { fontSize: 14, color: colors.default, fontWeight: "400", padding: 4, paddingHorizontal: 16 },
    closeHeader: { marginTop: 16, paddingVertical: 8, backgroundColor: colors.primary[500], borderRadius: 100 },
    closeText: { fontSize: 14, color: colors.white, fontWeight: "700", padding: 4, paddingHorizontal: 16, textAlign: "center" },
});
