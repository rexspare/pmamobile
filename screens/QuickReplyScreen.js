import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ImageBackground, FlatList, Image, TouchableHighlight, Pressable } from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { TextInput } from "react-native-gesture-handler";
import { isEmpty } from "lodash";
import { addMessage } from "../reducers/messages";
import dayjs from "dayjs";
import GoBackIcon from "../components/icons/GoBackIcon";
import CloseIcon from "../components/icons/CloseIcon";
import colors from "../constants/colors";
import { sendOperatorsMessage } from "../api/entities/operators";
import { previewMessageFormat } from "../utils/helpers";
import { USER_TYPES } from "../../pma-mobile/constants/constants";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";

// Import the WhatsApp background image
const whatsappBackground = require("../assets/image1.png");

const QuickReplyScreen = (props) => {
    const {
        navigation,
        route: {
            params: { quickReply, bottomSheetModalRef, sendCustomText, closeQuickReplyModal },
        },
    } = props;

    const { params = [], body = "", displayName = "", mediaUrl, source, roomId, appId, senderId } = quickReply || {};
    const [paramsValue, setParamsValue] = useState({});
    const dispatch = useDispatch();
    const [templateMessage, setTemplateMessage] = useState("");
    const userSession = useSelector((state) => state.userSession);
    const { providerId } = userSession;

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Pressable
                    onPress={() => {
                        navigation.goBack();
                        bottomSheetModalRef.current?.present();
                        setParamsValue({});
                    }}>
                    <GoBackIcon style={styles.iconHeader} />
                </Pressable>
            ),
            headerRight: () => (
                <Pressable
                    onPress={() => {
                        navigation.goBack();
                        setParamsValue({});
                    }}>
                    <CloseIcon style={styles.iconHeader} />
                </Pressable>
            ),
        });
    }, [navigation]);

    const onChangeParam = (text, param) => {
        setParamsValue({ ...paramsValue, [param]: text });
    };

    const sendQuickReply = async () => {
        let formattedMessage = body; // Initialize message with original body

        if (!isEmpty(params)) {
            // replace params in the message
            params.forEach((param) => {
                const paramValue = paramsValue[param.label] || `{{${param.param}}}`;
                formattedMessage = formattedMessage.replace(`{{${param.param}}}`, paramValue);
            });
        }
        const formMessage = {
            type: "TEXT",
            text: formattedMessage,
        };

        // Add message to Redux
        dispatch(addMessage(formMessage));
        try {
            // Await sending the custom text
            await sendCustomText(formMessage);
        } catch (error) {
            // Manejar errores aquí si es necesario
            console.error("Error al enviar el mensaje:", error);
        } 
        navigation.goBack();
    };

    const renderParams = ({ item }) => {
        return (
            <TextInput
                placeholder={`Escribe ${item.label} ${item.param}`}
                style={styles.paramsInput}
                value={paramsValue[item.label]}
                onChangeText={(text) => {
                    onChangeParam(text, item.label);
                }}
            />
        );
    };

    const isAParamEmpty = () => {
        if (isEmpty(params)) return false;
        const values = Object.values(paramsValue);
        const trimmedValues = values.map((val) => val.trim());
        const isEmptyValuePresent = trimmedValues.some((val) => isEmpty(val));

        return isEmptyValuePresent || values.length === 0;
    };

    const isEmptyParams = isAParamEmpty();

    return (
        <View style={styles.containerView}>
            <ScrollView style={{ margin: 20, flex: 1 }}>
                <Text style={styles.displayName}>{displayName}</Text>
                {!isEmpty(params) && (
                    <>
                        <Text style={styles.textHeader}>Parametros</Text>
                        <Text style={styles.paramDescription}>Escribe los parámetros para poder enviar el mensaje de una forma acertada.</Text>
                        <FlatList data={params} renderItem={renderParams} scrollEnabled={false} />
                    </>
                )}
                <Text style={styles.textHeader}>Vista previa</Text>
                <View style={styles.containerPreview}>
                    <ImageBackground source={whatsappBackground} imageStyle={{ borderRadius: 12 }}>
                        <View style={styles.imagePreviewContainer}>
                            {mediaUrl ? <Image source={{ uri: mediaUrl }} style={styles.imagePreview} /> : null}
                            <Text style={styles.previewBody}>{previewMessageFormat(body, params, paramsValue)}</Text>
                        </View>
                    </ImageBackground>
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <View style={styles.line} />
                <TouchableHighlight
                    underlayColor={isEmptyParams ? colors.gray[50] : colors.primary[500]}
                    style={isEmptyParams ? styles.buttonDisabled : styles.button}
                    onPress={!isEmptyParams && sendQuickReply}>
                    <Text 
                        style={isEmptyParams ? styles.disabledText : styles.text}>
                        Enviar
                    </Text>
                </TouchableHighlight>
            </View>
        </View>
    );
};

export default QuickReplyScreen;

const styles = StyleSheet.create({
    containerView: { flex: 1, backgroundColor: "#fff" },
    containerPreview: { flexDirection: "column", marginVertical: 20 },
    textHeader: { color: colors.default, fontWeight: "600", fontSize: 16, marginTop: 10 },
    imagePreviewContainer: {
        backgroundColor: colors.whatsapp[100],
        padding: 8,
        borderRadius: 10,
        borderBottomEndRadius: 0,
        margin: 16,
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
    previewBody: { fontSize: 14, marginVertical: 4, color: colors.text.primary },
    iconHeader: { color: colors.text.primary },
    line: { width: "100%", backgroundColor: colors.gray.outline, height: 0.5 },
    buttonDisabled: {
        backgroundColor: colors.gray[50],
        borderRadius: 25,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        margin: 16,
        marginBottom: 32,
    },
    button: {
        backgroundColor: colors.primary[500],
        borderRadius: 25,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        margin: 16,
        marginBottom: 32,
    },
    disabledText: { color: colors.default, fontWeight: "500", paddingHorizontal: 20, paddingVertical: 10 },
    text: { color: colors.white, fontWeight: "500", paddingHorizontal: 20, paddingVertical: 10 },
    paramsInput: {
        flex: 1,
        height: 40,
        borderColor: colors.gray.outline,
        borderWidth: 1,
        borderRadius: 6,
        paddingHorizontal: 10,
        marginVertical: 6,
    },
    displayName: {
        color: colors.text.primary,
        fontSize: 18,
        textAlign: "center",
        paddingHorizontal: 10,
        paddingBottom: 10,
        fontWeight: "600",
    },
    paramDescription: {
        color: colors.text.primary,
        fontSize: 14,
        paddingVertical: 8,
        fontWeight: "400",
    },
    footer: { justifyContent: "flex-end" },
});
