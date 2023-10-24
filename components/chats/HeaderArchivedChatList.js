import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useState } from "react";
import colors from "../../constants/colors";
import ArchivedIcon from "../icons/ArchivedIcon";
import DownIcon from "../icons/DownIcon";
import SearchArchivedRoom from "./SearchArchivedRoom";
import SortIcon from "../icons/SortIcon";
import SortModal from "../modals/SortModal";

const HeaderArchivedChatList = (props) => {
    const { setSortOrder, sortOrder } = props;
    const [sortModalVisible, setSortModalVisibility] = useState(false);

    const openSortModal = useCallback(() => {
        setSortModalVisibility(true);
    }, []);

    return (
        <View style={styles.headerContainer}>
            <View style={styles.headerTextView}>
                <ArchivedIcon style={styles.archivedIcon} />
                <Text style={styles.textHeader}>Archivados</Text>
            </View>
            <View style={styles.containerButtons}>
                <SearchArchivedRoom />
                <Pressable style={styles.button} onPress={openSortModal}>
                    <SortIcon style={styles.buttonIcon} />
                </Pressable>
                <SortModal
                    sortModalVisible={sortModalVisible}
                    setSortModalVisibility={setSortModalVisibility}
                    setSortOrder={setSortOrder}
                    sortOrder={sortOrder}
                />
            </View>
        </View>
    );
};

export default HeaderArchivedChatList;

const styles = StyleSheet.create({
    headerContainer: { marginHorizontal: 16, marginTop: 22, marginBottom: 12 },
    headerTextView: { flexDirection: "row", alignItems: "center" },
    textHeader: { color: colors.primary[500], fontSize: 22, fontWeight: "500", marginLeft: 10 },
    archivedIcon: { color: colors.primary[500] },
    buttonIcon: {
        width: 20,
        height: 20,
    },
    button: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.gray.outline,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 5,
    },
    containerButtons: { marginTop: 20, flexDirection: "row" },
});