import { View, Image, TextInput, StyleSheet, Pressable, Text } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import colors from "../../constants/colors";
import ArchivedIcon from "../icons/ArchivedIcon";
import SearchIcon from "../icons/SearchIcon";
import SortIcon from "../icons/SortIcon";
import { useDispatch } from "react-redux";
import SortModal from "../modals/SortModal";
import { setQueryChatSearch } from "../../reducers/queryChatSearch";

const SearchRoom = (props) => {
    const { sortOrder, setSortOrder } = props;
    const [searchRoom, setSearchRoom] = useState("");
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const debounceSearch = setTimeout(() => {
            if (!searchRoom || searchTerm === "") {
            }
        }, 500);
        return () => clearTimeout(debounceSearch);
    }, [searchRoom]);

    const [sortModalVisible, setSortModalVisibility] = useState(false);

    const openSortModal = useCallback(() => {
        setSortModalVisibility(true);
        handlePresentModal();
    }, []);

    const bottomSheetModalRef = useRef(null);

    const handlePresentModal = () => {
        bottomSheetModalRef.current?.present();
    };

    return (
        <View style={styles.containerSearchRoom}>
            <View style={styles.searchRoom}>
                <SearchIcon style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por nombre o ID"
                    onChangeText={(text) => {
                        setSearchRoom(text);
                        dispatch(setQueryChatSearch(text));
                    }}
                />
            </View>
            {/* <Pressable style={styles.button} onPress={() => props.navigation.navigate("ArchivedChatScreen")}>
                <ArchivedIcon style={styles.buttonIcon} />
            </Pressable> */}
            <Pressable style={styles.button} onPress={openSortModal}>
                <SortIcon style={styles.buttonIcon} />
            </Pressable>

            <SortModal
                sortModalVisible={sortModalVisible}
                setSortModalVisibility={setSortModalVisibility}
                setSortOrder={setSortOrder}
                sortOrder={sortOrder}
                bottomSheetModalRef={bottomSheetModalRef}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    containerSearchRoom: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.white,
        paddingHorizontal: 10,
        paddingBottom: 10,
    },
    searchRoom: {
        flexDirection: "row",
        flex: 1,
        borderRadius: 10,
        borderColor: colors.gray.outline,
        borderWidth: 1,
        padding: 10,
        marginRight: 5,
    },
    searchIcon: {
        width: 20,
        height: 20,
    },
    searchInput: {
        flex: 1,
        marginHorizontal: 12,
    },
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
});

export default SearchRoom;