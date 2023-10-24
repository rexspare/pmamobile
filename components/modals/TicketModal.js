import { FlatList, Pressable, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import React, { useCallback } from "react";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import CloseIcon from "../icons/CloseIcon";
import colors from "../../constants/colors";

const TicketModal = (props) => {
    const { bottomSheetModalRef, teamsList, setSelectedQueue } = props;

    const closeTicketModal = () => {
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
        <BottomSheetModal snapPoints={["72%"]} index={0} ref={bottomSheetModalRef} backdropComponent={renderBackdrop}>
            <View style={styles.modalContainer}>
                <Pressable style={styles.iconContainer} onPress={closeTicketModal}>
                    <CloseIcon />
                </Pressable>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Tickets en cola</Text>
                    <Text style={styles.headerTextDescription}>Selecciona un grupo de chats para ver las conversaciones en cola.</Text>
                </View>
                <FlatList
                    data={teamsList}
                    renderItem={({ item }) => (
                        <TouchableHighlight
                            underlayColor={colors.primary[100]}
                            style={styles.teamList}
                            onPress={() => {
                                setSelectedQueue(item);
                                closeTicketModal();
                            }}>
                            <>
                                <Text style={styles.ticketName}>{item?.value}</Text>
                                <Text style={styles.ticketTotal}>{item?.total}</Text>
                            </>
                        </TouchableHighlight>
                    )}
                    ListEmptyComponent={() => <Text style={styles.emptyList}>No tiene grupos para ver conversaciones en cola</Text>}
                />
            </View>
        </BottomSheetModal>
    );
};

export default TicketModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        borderRadius: 20,
        backgroundColor: colors.white,
        marginBottom: 10,
    },
    iconContainer: { flexDirection: "row", justifyContent: "flex-end", marginRight: 20, marginVertical: 16 },
    headerContainer: { flexDirection: "column", paddingHorizontal: "5%", marginBottom: 10 },
    headerText: { color: colors.secondary[100], fontSize: 18, fontWeight: "600" },
    headerTextDescription: { color: colors.secondary[100], fontSize: 14, marginTop: 16 },

    teamList: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray.outline,
    },
    ticketName: { color: colors.text.primary, fontSize: 14, fontWeight: "400", lineHeight: 20 },
    ticketTotal: { color: colors.primary[500], fontSize: 14, fontWeight: "400", lineHeight: 20 },

    emptyList: { fontSize: 16, textAlign: "center", color: colors.text.primary, fontWeight: "500", marginTop: 20 },
});
