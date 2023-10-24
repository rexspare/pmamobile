import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useDispatch } from "react-redux";
import colors from "../constants/colors";
import GoBackIcon from "../components/icons/GoBackIcon";
import { postRoomTags } from "../api/entities/bots";
import { setTags } from "../reducers/tags";

const TagScreen = (props) => {
    // Extract necessary props and state variables
    const {
        navigation = {},
        route: {
            params: { tags = [], allTags = [], roomInfo = {} },
        },
    } = props;
    const dispatch = useDispatch();
    const {
        bot: { id: botId },
        id: roomId,
    } = roomInfo;
    const [tagsChecked, setTagsChecked] = useState([]);

    useEffect(() => {
        const newTags = allTags.map((tag) => {
            const isChecked = tags.some((_tag) => _tag.id === tag.id);
            return { ...tag, isChecked };
        });
       setTagsChecked(newTags);
}, [tags, allTags]);

    const headerTags = () => (
        <View style={styles.headerContainer}>
            <Pressable style={styles.back} onPress={() => navigation.goBack()}>
                <GoBackIcon />
            </Pressable>
            <Text style={styles.title}>Etiquetas 🏷️</Text>
        </View>
    );

    const setCheckboxState = (id, isChecked) => {
        const newTags = tagsChecked.map((tag) => {
            if (tag.id === id) {
                return { ...tag, isChecked };
            }
            return tag;
        });
        setTagsChecked(newTags);
        sendTags(newTags);
    };

    const sendTags = async (newTags) => {
        const tagsChecked = newTags.filter((tag) => tag.isChecked);
        const chatTagsIds = tagsChecked.map((tag) => tag.id);

        const { data } = await postRoomTags({ botId, tags: chatTagsIds, roomId });
        dispatch(setTags(data.tags));
    };

    const renderTags = ({ item }) => (
        <BouncyCheckbox
            style={{ padding: 10 }}
            iconStyle={{ marginLeft: 15 }}
            text={item.name.es}
            fillColor={item.color}
            isChecked={item.isChecked}
            disableBuiltInState
            textStyle={{
                textDecorationLine: "none",
            }}
            onPress={() => setCheckboxState(item.id, !item.isChecked)}
        />
    );

    return (
        <View style={{ flex: 1, backgroundColor: colors.white, paddingBottom: 20 }}>
            <FlatList
                data={tagsChecked}
                renderItem={renderTags}
                keyExtractor={(item) => item.id}
                style={{ paddingHorizontal: 8 }}
                ListHeaderComponent={headerTags}
            />
        </View>
    );
};

export default TagScreen;

const styles = StyleSheet.create({
    iconHeader: { color: colors.text.primary },
    headerContainer: { flexDirection: "row", margin: 10, alignItems: "center" },
    back: { margin: 2 },
    title: { color: colors.text.primary, fontSize: 18, fontWeight: "600", marginHorizontal: 10 },
});
