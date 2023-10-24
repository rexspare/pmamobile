import { Image, ImageBackground, Pressable, StyleSheet, Text, TextInput, TouchableHighlight, View } from "react-native";
import React, { useCallback, useState, useContext } from "react";
import { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";
import CloseIcon from "../icons/CloseIcon";
import colors from "../../constants/colors"; 
import EyeIcon from "../icons/EyeIcon";
import { useDispatch } from 'react-redux';
import { useMacroTemplates } from "../../api/query/useMacroTemplates";
import { useSelector } from "react-redux";
import SearchIcon from "../icons/SearchIcon";
import { isEmpty } from "lodash";
import { TYPE_MESSAGE, USER_TYPES } from "../../constants/constants";
import { addMessage } from "../../reducers/messages";
import { sendOperatorsMessage } from "../../api/entities/operators";
import uuid from "react-native-uuid";
import dayjs from "dayjs";

const whatsappBackground = require("../../assets/image1.png");

const QuickReplyModal = (props) => {
    const { bottomSheetModalRef, room, navigation } = props;
    const company = useSelector((state) => state.company);
    const userSession = useSelector((state) => state.userSession);
    const { id: companyId } = company;
    const { teams: teamIds } = userSession;
    const { appId: botId } = room;
    const dispatch = useDispatch();


    const [queryQuickReply, setQueryQuickReply] = useState("");

    const { data: macroTemplates, isLoading } = useMacroTemplates({
        companyId,
        bots: [botId],
        teams: teamIds,
        shoulPaginate: false,
        joinMacros: true,
        isVisible: 1,
    });

    const closeQuickReplyModal = () => {
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

    const [preview, showPreview] = useState({});
    const [selectedQuickReply, setSelectedQuickReply] = useState({});
    const disabled = isEmpty(selectedQuickReply);

    const quickreplyButton = () => {
        closeQuickReplyModal();
        

        // console.log("SEND QUICK REPLY", selectedQuickReply);
        navigation.navigate("QuickReply", { quickReply: selectedQuickReply, bottomSheetModalRef, sendCustomText, closeQuickReplyModal });
        setSelectedQuickReply({});
        showPreview({});
    };

    const sendCustomText = async (message) => {
        const by = USER_TYPES.OPERATOR;
        const { appId, source } = room;
        let { senderId } = room;
        const roomId = room.id;

        // Prepare the form message with necessary data
        const formMessage = {
            by,
            source,
            roomId,
            botId: appId,
            userId: senderId,
            bubble: message,
            id: uuid.v4(), // Use uuid.v4() to generate a unique ID
            createdAt: dayjs().valueOf(),
        };

        // Add message to Redux
        dispatch(addMessage(formMessage));
        sendOperatorsMessage(formMessage);
    };

    const parseTemplateMessage = (template, params) => {
        let tempString = template;
        if (!isEmpty(params)) {
            params.forEach((param) => {
                tempString = tempString.replace(`{{${param.param}}}`, message.paramValue[param.label] || `{{${param.param}}}`);
            });
            return tempString;
        }
        return { ...template, type: TYPE_MESSAGE.TEXT };
    };

    const parseTemplateImagesMessage = (template, params, mediaUrl) => {
        let tempString = template;
        if (!isEmpty(params)) {
            params.forEach((param) => {
                tempString = tempString.replace(`{{${param.param}}}`, message.paramValue[param.label] || `{{${param.param}}}`);
            });
            return { caption: tempString, mediaUrl: mediaUrl, type: TYPE_MESSAGE.IMAGE };
        }
        return { caption: template, mediaUrl: mediaUrl, type: TYPE_MESSAGE.IMAGE };
    };

    const previewMessage = (message) => {
        if (message.mediaUrl) {
            return parseTemplateImagesMessage(message.template || "", message.params, message.mediaUrl);
        } else {
            return parseTemplateMessage(message.template || "", message.params);
        }
    };

    const filteredMacroTemplates = macroTemplates?.filter((template) => {
        // compare quick message name or ID with queryQuickReply
        const { displayName, id } = template;
        const searchValue = queryQuickReply.toLowerCase(); 
        return displayName.toLowerCase().includes(searchValue) || id.toString().toLowerCase().includes(searchValue);
    });

    
    const renderMacroTemplate = ({ item }) => {
        return (
            <Pressable
                style={selectedQuickReply.id === item.id ? styles.selectedItem : styles.quickreplyItem}
                onPress={() => {
                    if (selectedQuickReply.id === item.id) {
                        setSelectedQuickReply({});
                        return;
                    }
                    setSelectedQuickReply(item);
                }}>
                <View style={styles.containerRender}>
                    <View style={{ flex: 1, justifyContent: "center", marginHorizontal: 8 }}>
                        <Text numberOfLines={1} style={styles.displayName}>
                            {item.displayName}
                        </Text>
                        <Text style={styles.textBody} numberOfLines={1}>
                            {item.body}
                        </Text>
                    </View>
                    <View style={styles.containerRender}>
                        <TouchableHighlight underlayColor={colors.primary[100]} onPress={() => showPreview(item)} style={styles.touchableHighlight}>
                            <EyeIcon />
                        </TouchableHighlight>
                    </View>
                </View>
                {!isEmpty(preview) && preview.id === item.id ? (
                    <>
                        <View style={styles.containerPreview}>
                            <Text style={styles.textPreview}>Vista previa</Text>
                            <Pressable onPress={() => showPreview({})} style={{ paddingHorizontal: 5 }}>
                                <CloseIcon style={styles.closeIcon} />
                            </Pressable>
                        </View>
                        <ImageBackground source={whatsappBackground} resizeMode="cover" style={styles.imageBackground}>
                            <View style={styles.imagePreviewContainer}>
                                {item?.mediaUrl ? <Image source={{ uri: item.mediaUrl }} style={styles.imagePreview} /> : null}
                                <Text style={styles.previewBody}>{item.body}</Text>
                            </View>
                        </ImageBackground>
                    </>
                ) : null}
            </Pressable>
        );
    };

    return (
        <BottomSheetModal snapPoints={["88%"]} index={0} ref={bottomSheetModalRef} backdropComponent={renderBackdrop}>
            <View style={styles.modalContainer}>
                <View style={styles.containerTitle}>
                    <Pressable style={styles.iconContainer} onPress={closeQuickReplyModal}>
                        <CloseIcon />
                    </Pressable>
                    <Text style={styles.title}>Mensajes rapidos</Text>
                    <Pressable style={styles.iconContainer} onPress={closeQuickReplyModal}>
                        {/* <AddIcon /> */}
                    </Pressable>
                </View>
                <View style={styles.headerContainer}>
                    <View style={styles.searchRoom}>
                        <SearchIcon style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            value={queryQuickReply}
                            placeholder="Buscar por nombre o ID"
                            onChangeText={(text) => {
                                setQueryQuickReply(text);
                            }}
                        />
                    </View>
                </View>
                <BottomSheetFlatList
                    data={filteredMacroTemplates}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMacroTemplate}
                    ListEmptyComponent={() => <Text style={styles.emptyList}>No tiene mensajes rapidos</Text>}
                />
                <TouchableHighlight
                    underlayColor={colors.primary[300]}
                    style={disabled ? styles.sendButtonDisabled : styles.sendButton}
                    onPress={disabled ? null : quickreplyButton}>
                    <Text style={disabled ? styles.disabledText : styles.text}>Siguiente</Text>
                </TouchableHighlight>
            </View>
        </BottomSheetModal>
    );
};

export default QuickReplyModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        borderRadius: 20,
        backgroundColor: colors.white,
    },
    iconContainer: { flexDirection: "row" },
    headerContainer: { flexDirection: "column", paddingHorizontal: "5%", marginBottom: 10 },
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
    searchInput: { flex: 1, marginHorizontal: 12, height: 40, color: colors.secondary[100], paddingVertical: 10, zIndex: 1 },
    emptyList: { fontSize: 16, textAlign: "center", color: colors.text.primary, fontWeight: "500", marginTop: 20 },
    selectedItem: {
        backgroundColor: colors.primary[100],
        padding: 10,
        flexDirection: "column",
        borderBottomColor: colors.gray.outline,
        borderBottomWidth: 1,
    },
    quickreplyItem: {
        padding: 10,
        flexDirection: "column",
        borderBottomColor: colors.gray.outline,
        borderBottomWidth: 1,
    },
    sendButtonDisabled: {
        backgroundColor: colors.gray[50],
        borderRadius: 25,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        margin: 16,
        marginBottom: 32,
    },
    sendButton: {
        backgroundColor: colors.primary[500],
        borderRadius: 25,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        margin: 16,
        marginBottom: 32,
    },
    text: { color: colors.secondary[100], fontSize: 12 },
    disabledText: { color: colors.default, fontWeight: "500", paddingHorizontal: 20, paddingVertical: 10 },
    text: { color: colors.white, fontWeight: "500", paddingHorizontal: 20, paddingVertical: 10 },
    containerRender: { flexDirection: "row" },
    touchableHighlight: {
        paddingHorizontal: 4,
        borderColor: colors.primary[500],
        borderWidth: 1,
        borderRadius: 8,
        marginVertical: 8,
        alignItems: "center",
        marginHorizontal: 4,
        padding: 4,
        paddingHorizontal: 8,
    },
    textBody: { color: colors.default },
    containerPreview: { marginVertical: 8, flexDirection: "row", justifyContent: "space-between" },
    textPreview: { paddingHorizontal: 10, color: colors.default },
    imageBackground: { flex: 1, marginHorizontal: 10, marginRight: 42 },
    imagePreviewContainer: {
        backgroundColor: colors.whatsapp[100],
        padding: 8,
        borderRadius: 10,
        borderBottomEndRadius: 0,
        margin: 12,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.18,
        shadowRadius: 2.62,

        elevation: 4,
    },
    imagePreview: { width: "100%", height: 90, borderRadius: 6, marginBottom: 4 },
    previewBody: { fontSize: 12, marginVertical: 4 },
    closeIcon: { color: "#374361" },
    displayName: { color: colors.secondary[100], fontSize: 14, fontWeight: "500" },
    containerTitle: {
        flexDirection: "row",
        paddingHorizontal: 20,
        paddingVertical: 12,
        alignItems: "center",
        borderBottomColor: colors.gray.outline,
        borderBottomWidth: 1,
        justifyContent: "space-between",
    },
    title: { fontSize: 14, color: colors.secondary[100], fontWeight: "700" },
});