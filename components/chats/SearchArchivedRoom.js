import { Pressable, StyleSheet, Text, TextInput } from "react-native";
import React, { useRef, useState } from "react";
import SearchIcon from "../icons/SearchIcon";
import colors from "../../constants/colors";
import { get } from "lodash";
import GlobalSearchModal from "../modals/GlobalSearchModal";

const SearchArchivedRoom = (props) => {
    const [searchArchived, setSearchArchived] = useState();
    const [searchText, setSearchText] = useState("");
    const bottomSheetModalRef = useRef(null);

    const handleSearchTextChange = (text) => {
        setSearchText(text);
    };

    const performSearch = () => { 
        bottomSheetModalRef.current.present(searchText);
    };

    return (
        <>
            <Pressable style={styles.searchRoom} onPress={performSearch}>
                <SearchIcon style={styles.searchIcon} />
                {/* <TextInput style={{ color: colors.default, marginLeft: 6 }}>{get(searchArchived, "", "Buscar por nombre o ID")}</TextInput> */}
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por nombre o ID"
                    onChangeText={handleSearchTextChange}
                    value={searchText}
                />
            </Pressable>
            <GlobalSearchModal bottomSheetModalRef={bottomSheetModalRef} />
        </>
    );
};

export default SearchArchivedRoom;

const styles = StyleSheet.create({
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
});