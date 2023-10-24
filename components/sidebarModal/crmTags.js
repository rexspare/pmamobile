import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Pressable, TouchableHighlight } from "react-native";
import { Octicons } from "@expo/vector-icons";
import colors from "../../constants/colors";
import sizes from "../../constants/sizes";
import AddIcon from "../icons/AddIcon";
import { getTags } from "../../api/entities/company";
import { useSelector, useDispatch } from 'react-redux';


const CrmTags = (props) => {
    const { isArchived, roomInfo, navigation } = props;
    const tags = useSelector((state) => state.tags);
    const dispatch = useDispatch(); 

    const [showAllTags, setShowAllTags] = useState(false);
    const [allTags, setAllTags] = useState([]);
    const tagsQuantity = tags?.length;
    const userSession = useSelector((state) => state.userSession);
    const { companyId, teams = [] } = userSession;
    const {
        bot: { id: botId },
    } = roomInfo;

    const getAllTags = async () => {
        const { data } = await getTags({ companyId, botId, teams });
        console.log("Datos recibidos de la API:", data);
        setAllTags(data);
    };

    useEffect(() => {
        console.log("Efecto de useEffect en CRMTags");
        getAllTags();
    }, [companyId, tags]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Etiquetas ({tagsQuantity})</Text>
            <View style={styles.tagsContainer}>
                <View numberOfLines={2} style={[styles.tagsGrid, { height: showAllTags ? "auto" : 29 }]}>
                    {tags.map((tag) => (
                        <Pressable key={tag?.id} style={[styles.tag, { backgroundColor: tag?.color }]}>
                            <Text style={styles.tagText}>{tag?.name?.es}</Text>
                            {!isArchived && <Octicons name="x-circle" size={15} color={colors.primary.dark} />}
                        </Pressable>
                    ))}
                </View>
                {!isArchived && (
                    <TouchableHighlight
                        underlayColor={colors.primary[300]}
                        style={styles.newTag}
                        onPress={() => navigation.navigate("TagScreen", { tags, allTags, roomInfo })}>
                        <AddIcon style={{ color: colors.primary[500], width: 18, height: 18 }} />
                    </TouchableHighlight>
                )}
            </View>
            {tagsQuantity > 0 && (
                <Pressable onPress={() => setShowAllTags(!showAllTags)}>
                    <Text style={styles.renderAll}>{!showAllTags ? "Ver todo +" : "Ver menos -"}</Text>
                </Pressable>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        borderTopColor: colors.gray.outline,
        borderBottomColor: colors.gray.outline,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 16,
    },
    header: {
        fontWeight: "700",
        color: colors.secondary[100],
        marginBottom: 9,
    },
    tagsContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        gap: 27,
    },
    tagsGrid: {
        flex: 1,
        flexWrap: "wrap",
        flexDirection: "row",
        gap: 7,
        overflow: "hidden",
        paddingBottom: 7,
    },
    tag: {
        flexDirection: "row",
        gap: 7.5,
        paddingVertical: 3,
        paddingLeft: 12,
        paddingRight: 8,
        height: 26,
        borderRadius: 80,
        justifyContent: "center",
        alignItems: "center",
    },
    tagText: {
        fontSize: sizes.fontLarge,
        fontWeight: "400",
        color: colors.primary.dark,
    },
    newTag: {
        borderWidth: 1,
        borderRadius: 100,
        borderColor: colors.primary[500],
        justifyContent: "center",
        alignItems: "center",
        width: 26,
        height: 26,
    },
    renderAll: {
        marginTop: 13,
        fontSize: sizes.fontLarge,
        fontWeight: "700",
        color: colors.primary[500],
        textDecorationLine: "underline",
    },
});

export default CrmTags;