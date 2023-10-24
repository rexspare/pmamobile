import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import React, { useCallback, useState } from "react";
import { BottomSheetBackdrop, BottomSheetModal } from "@gorhom/bottom-sheet";
import CloseIcon from "../icons/CloseIcon";
import colors from "../../constants/colors";
import SearchIcon from "../icons/SearchIcon";
import ClockIcon from "../icons/ClockIcon";
import DownIcon from "../icons/DownIcon";
import { get, isEmpty } from "lodash";

const typeSearchBy = [
    { id: 0, name: "Id", searchBy: "recipient.id.phoned,sender.id.phoned", isNumber: false },
    { id: 1, name: "Mensajes", searchBy: "bubble.text.folded", isNumber: false },
    { id: 2, name: "Cliente", searchBy: "sender.names,recipient.names", isNumber: false },
];

const GlobalSearchModal = (props) => {
    const { bottomSheetModalRef, fetchSearch } = props;

    const [searchParams, setSearchParams] = useState({ search: "", searchBy: { id: null, name: "", searchBy: "" } });

    const closeGlobalSearchModal = () => {
        setSearchParams({ search: "", searchBy: { id: null, name: "", searchBy: "" } });
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
                <View style={styles.headerContainer}>
                    <View style={styles.searchRoomUnclicked}>
                        <SearchIcon style={styles.searchIcon} />
                        {!isEmpty(searchParams.searchBy?.name) && (
                            <View style={{ backgroundColor: colors.primary[100], borderRadius: 8, paddingHorizontal: 6, marginLeft: 4 }}>
                                <Text style={{ color: colors.default, fontSize: 14, fontWeight: "500" }}>{get(searchParams, "searchBy.name")}</Text>
                            </View>
                        )}
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar"
                            value={searchParams.search}
                            clearButtonMode="always"
                            onChangeText={(text) => {
                                setSearchParams({ ...searchParams, search: text });
                            }}
                        />
                    </View>
                    <Pressable style={{ paddingHorizontal: 10 }} onPress={closeGlobalSearchModal}>
                        <Text style={{ color: colors.primary[500], lineHeight: 20, fontSize: 14, textAlign: "center", fontWeight: "700" }}>
                            Limpiar
                        </Text>
                    </Pressable>
                </View>

                <ScrollView>
                    <View style={styles.typeContainer}>
                        {typeSearchBy.map((item, index) => (
                            <Pressable
                                key={index}
                                style={searchParams.searchBy.id === item.id ? styles.selectedTypeSearch : styles.unSelectedTypeSearch}
                                onPress={() => {
                                    if (!isEmpty(searchParams.searchBy?.name) && searchParams.searchBy.id === item.id) {
                                        setSearchParams({ ...searchParams, searchBy: { id: null, name: "", searchBy: "" } });
                                    } else {
                                        setSearchParams({ ...searchParams, searchBy: item });
                                    }
                                }}>
                                <Text style={styles.typeSearchName}>Buscar por {item.name}</Text>
                                <DownIcon style={styles.downIcon} />
                            </Pressable>
                        ))}
                    </View>

                    <View style={styles.containerRecents}>
                        <Text style={styles.headerRecent}>Busquedas recientes</Text>
                        {/* <Pressable style={{ flexDirection: "row", alignItems: "center" }}>
                            <ClockIcon style={styles.clockIcon} />
                            <Text style={styles.previousSeachText}>BuscarPor id</Text>
                        </Pressable> */}
                    </View>
                </ScrollView>
                <TouchableHighlight
                    style={searchParams.search.length > 3 ? styles.searchButtonEnabled : styles.searchButtonDisabled}
                    onPress={searchParams.search.length > 3 ? fetchSearch : null}>
                    <Text style={searchParams.search.length > 3 ? styles.searchButtonEnabled.text : styles.searchButtonDisabled.text}>Buscar</Text>
                </TouchableHighlight>
            </View>
        </BottomSheetModal>
    );
};

export default GlobalSearchModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        borderRadius: 20,
        backgroundColor: colors.white,
        marginBottom: 10,
        flexDirection: "column",
    },
    headerContainer: { borderBottomColor: colors.gray.outline, borderBottomWidth: 1, flexDirection: "row", padding: 12, alignItems: "center" },
    searchRoomUnclicked: {
        flex: 1,
        padding: 10,
        flexDirection: "row",
        borderRadius: 10,
        borderColor: colors.gray.outline,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "flex-start",
    },
    searchIcon: {
        width: 18,
        height: 18,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        marginLeft: 8,
        color: colors.secondary[100],
    },

    typeContainer: { borderBottomColor: colors.gray.outline, borderBottomWidth: 1, flexDirection: "column", padding: 12 },
    typeSearchName: {
        color: colors.secondary[100],
        fontSize: 14,
        lineHeight: 20,
        fontWeight: "600",
    },
    downIcon: {
        transform: [{ rotate: "270deg" }],
        color: colors.secondary[100],
    },

    selectedTypeSearch: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
        marginVertical: 2,
        backgroundColor: colors.primary[100],
        borderRadius: 10,
        paddingHorizontal: 5,
    },
    unSelectedTypeSearch: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
        marginVertical: 2,
        borderRadius: 10,
        paddingHorizontal: 5,
    },

    containerRecents: { borderBottomColor: colors.gray.outline, borderBottomWidth: 1, flexDirection: "column", padding: 12 },
    headerRecent: { color: colors.default, fontSize: 14, lineHeight: 20, fontWeight: "600", paddingVertical: 5 },
    clockIcon: { width: 20, height: 20, color: colors.secondary[100] },
    previousSeachText: {
        color: colors.secondary[100],
        fontSize: 14,
        lineHeight: 20,
        fontWeight: "600",
        paddingVertical: 5,
        marginHorizontal: 8,
    },
    emptyList: { fontSize: 16, textAlign: "center", color: colors.text.primary, fontWeight: "500", marginTop: 20 },

    searchButtonEnabled: {
        backgroundColor: colors.primary[500],
        margin: 16,
        borderRadius: 20,
        padding: 10,
        alignItems: "center",
        text: {
            fontWeight: "600",
            fontSize: 16,
            color: colors.white,
        },
    },
    searchButtonDisabled: {
        backgroundColor: colors.gray[50],
        margin: 16,
        borderRadius: 20,
        padding: 10,
        alignItems: "center",
        text: {
            fontWeight: "600",
            fontSize: 16,
            color: colors.default,
        },
    },
});