import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import get from "lodash/get";
import has from "lodash/has";
import isEmpty from "lodash/isEmpty";
import { useConversationStart } from "../../api/query/useConversationStart";
import ContactModalIcon from "../icons/ContactModalIcon";
import CloseIcon from "../icons/CloseIcon";
import colors from "../../constants/colors";

const ContactModal = (props) => {
    const { room, name, contactModalVisibility, setContactModalVisibility, navigation } = props;
    const company = useSelector((state) => state.company);
    const userSession = useSelector((state) => state.userSession);
    const [startConversationParams, setStartConversationParams] = useState({});

    const { data: conversationStartReq, isFetching, refetch } = useConversationStart(startConversationParams);

    const closeContactModal = async () => {
        setContactModalVisibility(false);
    };

    useEffect(() => {
        const hasResumeConversations = get(company, "properties.operatorView.hasResumeConversations", false);
        const conversationParams = {
            botId: get(room, "bot.id", ""),
            userId: get(room, "_id", room.id),
            operatorId: userSession.operatorId,
            ...(hasResumeConversations ? { resumeConversation: true } : {}),
        };
        setStartConversationParams(conversationParams);
    }, [company, userSession]);

    useEffect(() => {
        if (has(conversationStartReq, "message.conversationId") && !isFetching) {
            navigation.navigate("Home");
        }
    }, [conversationStartReq, isFetching]);

    const startArchivedConversation = () => {
        refetch();
        navigation.navigate("Active");
    };

    return (
        <Modal animationType="none" transparent visible={contactModalVisibility} onRequestClose={closeContactModal}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Pressable style={styles.iconPosition} onPress={closeContactModal}>
                        <CloseIcon />
                    </Pressable>
                    <ContactModalIcon />
                    <View style={styles.headerText}>
                        <Text style={styles.constactText}>Contactar a </Text>
                        <Text style={styles.selectedName}>{name}</Text>
                    </View>
                    <Text style={styles.simpleText}>Estas a punto de contactar a este cliente</Text>
                    <Text style={styles.simpleText}>Te gustaria continuar?</Text>
                    {!isEmpty(conversationStartReq?.message) && typeof conversationStartReq.message === "string" ? (
                        <Text style={styles.errorMessage}>{conversationStartReq?.message}</Text>
                    ) : null}
                    <View style={styles.buttonsContainer}>
                        <Pressable style={styles.noButton} onPress={closeContactModal}>
                            <Text style={styles.noText}>No</Text>
                        </Pressable>
                        <Pressable style={styles.yesButton} onPress={startArchivedConversation}>
                            {isFetching ? <ActivityIndicator color="white" /> : <Text style={styles.yesText}>Sí</Text>}
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ContactModal;

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        flex: 0,
        top: "20%",
        borderRadius: 20,
        padding: 22,
        backgroundColor: colors.white,
        margin: 25,
    },
    iconPosition: { flexDirection: "row", justifyContent: "flex-end" },
    headerText: { marginTop: 24, flexDirection: "row" },
    constactText: { color: colors.primary[500], fontSize: 18, fontWeight: "400" },
    selectedName: { color: colors.primary[500], fontSize: 18, fontWeight: "600" },
    simpleText: { color: colors.default, marginTop: 20, fontSize: 14 },
    buttonsContainer: {
        flexDirection: "row",
        marginTop: 20,
        justifyContent: "flex-end",
    },
    noButton: {
        paddingVertical: 8,
        paddingHorizontal: 22,
        backgroundColor: colors.white,
        borderRadius: 25,
        width: "25%",
        alignItems: "center",
        justifyContent: "center",
    },
    noText: { color: colors.primary[500], fontWeight: "600" },
    yesButton: {
        paddingVertical: 8,
        paddingHorizontal: 22,
        backgroundColor: colors.primary[500],
        borderRadius: 25,
        width: "25%",
        alignItems: "center",
        justifyContent: "center",
    },
    yesText: { color: colors.white, fontWeight: "600" },
    errorMessage: { fontSize: 12, color: colors.red[300], marginTop: 16, textAlign: "center" },
});
