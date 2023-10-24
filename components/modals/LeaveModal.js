import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import React, { useState } from "react";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import orderBy from "lodash/orderBy";
import { useSelector } from "react-redux";
import RNPickerSelect from "react-native-picker-select";
import colors from "../../constants/colors";
import WarningIcon from "../icons/WarningIcon";
import CloseIcon from "../icons/CloseIcon";
import { useDynamicEvents } from "../../api/query/useDynamicEvents";
import OtherMotivesIcon from "../icons/OtherMotivesIcon";
import DownIcon from "../icons/DownIcon";
import { closeConversation } from "../../api/entities/conversation";
import { useFlows } from "../../api/query/useFlows";
import JelouApiV1 from "../../api/JelouApiV1";
import { getName } from "../../utils/helpers";
import ToastClose from ".././common/ToastClose";

const LeaveModal = (props) => {
    const { leaveModalVisibility, setLeaveModalVisibility, type = "conversation_end", navigation } = props;
    const company = useSelector((state) => state.company);
    const userSession = useSelector((state) => state.userSession);
    const lang = useSelector((state) => state.userSession?.lang) ?? "es";
    const closeLeaveModal = () => {
        setLeaveModalVisibility({ show: false, room: {}, bot: {} });
    };

    const room = leaveModalVisibility?.room;
    const nameRoom = getName(room);
    const senderId = get(room, "senderId", "");
    const bot = leaveModalVisibility?.bot;
    const hasSetFlowOnLeave = get(bot, "properties.setFlowOnLeave", false);

    const { data: motivesStatus = [], isLoading } = useDynamicEvents({ companyId: get(company, "id", "") });

    const allMotives = motivesStatus.filter((motive) => motive.type === type);
    const motives = allMotives.filter((motive) => motive.visualizationType === "buttons");
    const otherMotives = allMotives.filter((motive) => motive.visualizationType === "dropdown");
    const selectedMotive = allMotives.find((motive) => motive.isSelected === true);
    const [selected, setSelected] = useState(selectedMotive);
    const [otherMotivesVisibility, setOtherMotivesVisibility] = useState(false);
    const [otherMotive, setOtherMotive] = useState("Otros Motivos");
    const [flowId, setFlowId] = useState(null);
    const botId = get(bot, "id", "");
    const [isToastVisible, setToastVisible] = useState(false);

    const handleSelectOption = (value, section) => {
        const name = get(value, "name", "");
        setSelected(value);
        setOtherMotivesVisibility(false);
        if (section === "motive") return;
        setOtherMotive(get(value, `translations.${lang}`, name));
    };

    //console.log("motives:", motives);

    const closeRoomConversation = async (motive = {}, flowId = null, showToastCallback) => {
        const operatorId = get(userSession, "providerId");
        const userId = senderId.replace("+", "").toString();
        await closeConversation({ botId, operatorId, userId, dynamicEvent: motive }).then(async (response) => {
            const onLeaveFlowId = get(bot, "properties.onLeaveFlowId", null);

            if (flowId) {
                await JelouApiV1.post(`/bots/${botId}/users/${senderId}/flow/${flowId}`);
            }

            if (onLeaveFlowId && !flowId) {
                const ttl = get(bot, "properties.onLeaveFlowIdTtl", 3600);
                const key = `${bot.id}:user:${userId}:flow_id`;
                const value = `${onLeaveFlowId}`;
                await storeValuesOnLeave({ companyId: company.id, key, value, ttl });
            }
            showCustomToast();
        });
    };

    const showCustomToast = () => {
        setToastVisible(true);

        setTimeout(() => {
            closeLeaveModal();
            navigation.navigate("Home");
            setToastVisible(false);
        }, 2000);
    };
    const selectFlow = (data) => {
        setSelected(null);
        setFlowId(data);
    };

    const { data: flows = [], isLoading: isLoadingFlows } = useFlows({ botId });

    return (
        <>
            <Modal animationType="none" transparent visible={leaveModalVisibility?.show} onRequestClose={closeLeaveModal}>
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        <Pressable style={styles.iconPosition} onPress={closeLeaveModal}>
                            <CloseIcon />
                        </Pressable>
                        <WarningIcon />
                        <View style={styles.headerText}>
                            <Text style={styles.contactText}>
                                Estás a punto de salir de la conversación con <Text style={styles.selectedName}>{nameRoom}</Text>
                            </Text>
                        </View>
                        <Text style={styles.simpleText}>Si abandonas este chat, es posible que no puedas contactar a este usuario nuevamente.</Text>
                        {hasSetFlowOnLeave ? (
                            <Text style={styles.boldText}>Motivo de Salida</Text>
                        ) : (
                            <Text style={styles.simpleText}>¿Te gustaría continuar?</Text>
                        )}
                        <ScrollView>
                            {hasSetFlowOnLeave ? (
                                <>
                                    {motives.map((motive) => (
                                        <TouchableHighlight
                                            key={motive.id}
                                            underlayColor={colors.primary[100]}
                                            onPress={() => handleSelectOption(motive, "motive")}>
                                            <View
                                                style={
                                                    motive.id === selected?.id ? styles.selectedButtonContainer : styles.nonSelectedButtonsContainer
                                                }>
                                                {/* <SurveyIcon /> */}
                                                {motive.icon && (
                                                    <Image
                                                        style={styles.iconsMotive}
                                                        source={{
                                                            uri: `${get(motive, "icon", "")}`
                                                        }}
                                                        
                                                        onError={() => {
                                                            console.log("Error al cargar la imagen");
                                                        }}
                                                    />
                                                )}

                                                <Text style={motive.id === selected?.id ? styles.selectedButtonText : styles.nonSelectedButtonText}>
                                                    {get(motive, `translations.${lang}`, get(motive, "name", ""))}
                                                </Text>
                                            </View>
                                        </TouchableHighlight>
                                    ))}
                                    {!isEmpty(otherMotives) ? (
                                        <TouchableHighlight
                                            style={styles.nonSelectedButtonsContainer}
                                            underlayColor={colors.primary[100]}
                                            onPressIn={() => setOtherMotivesVisibility(!otherMotivesVisibility)}>
                                            <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
                                                <OtherMotivesIcon />
                                                <Text style={{ color: colors.default, marginLeft: 12 }}>{otherMotive}</Text>
                                                {otherMotivesVisibility ? (
                                                    <View style={{ transform: [{ rotate: "180deg" }], position: "absolute", right: 0 }}>
                                                        <DownIcon style={{ color: colors.default }} />
                                                    </View>
                                                ) : (
                                                    <View style={{ position: "absolute", right: 0 }}>
                                                        <DownIcon style={{ color: colors.default }} />
                                                    </View>
                                                )}
                                            </View>
                                        </TouchableHighlight>
                                    ) : null}
                                </>
                            ) : null}
                            {otherMotivesVisibility
                                ? otherMotives.map((otherMotive) => (
                                      <TouchableHighlight
                                          key={otherMotive.id}
                                          style={
                                              otherMotive.id === selected?.id ? styles.selectedButtonContainer : styles.nonSelectedButtonsContainer
                                          }
                                          underlayColor={colors.primary[100]}
                                          onPress={() => handleSelectOption(otherMotive, "otherMotive")}>
                                          <Text style={otherMotive.id === selected?.id ? styles.selectedButtonText : styles.nonSelectedButtonText}>
                                              {get(otherMotive, `translations.${lang}`, get(otherMotive, "name", ""))}
                                          </Text>
                                      </TouchableHighlight>
                                  ))
                                : null}
                            {hasSetFlowOnLeave && isEmpty(allMotives) && !isLoadingFlows && (
                                <RNPickerSelect
                                    placeholder={{ label: "Seleccione un flujo", value: null }}
                                    value={flowId}
                                    onValueChange={(value) => {
                                        selectFlow(value);
                                    }}
                                    items={orderBy(flows, ["title"], ["asc"])}
                                    style={pickerSelectStyles}
                                />
                            )}
                        </ScrollView>
                        {hasSetFlowOnLeave && !isEmpty(allMotives) ? (
                            <View style={styles.buttonsContainer}>
                                <Pressable style={styles.goBackButton} onPress={closeLeaveModal}>
                                    <Text style={styles.noText}>Regresar</Text>
                                </Pressable>
                                <Pressable style={styles.closeConversationButton} onPress={() => closeRoomConversation(selected, flowId)}>
                                    <Text style={styles.yesText}>Cerrar conversación</Text>
                                </Pressable>
                            </View>
                        ) : (
                            <View style={styles.buttonsContainer}>
                                <Pressable style={styles.noButton} onPress={closeLeaveModal}>
                                    <Text style={styles.noText}>No</Text>
                                </Pressable>
                                <Pressable style={styles.yesButton} onPress={() => closeRoomConversation(selected, flowId)}>
                                    <Text style={styles.yesText}>Si</Text>
                                </Pressable>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>{isToastVisible && <ToastClose nameRoom={nameRoom} />}</View>
        </>
    );
};

export default LeaveModal;

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        flex: 0,
        top: "10%",
        borderRadius: 20,
        padding: 22,
        backgroundColor: colors.white,
        margin: 25,
        maxHeight: "70%",
    },
    iconPosition: { flexDirection: "row", justifyContent: "flex-end" },
    headerText: { marginTop: 24, flexDirection: "row" },
    contactText: { color: colors.yellow[100], fontSize: 18, fontWeight: "400" },
    selectedName: { color: colors.yellow[100], fontSize: 18, fontWeight: "600" },
    simpleText: { color: colors.default, marginTop: 20, fontSize: 14 },
    boldText: { color: colors.default, marginTop: 20, fontSize: 14, fontWeight: "700" },
    buttonsContainer: {
        flexDirection: "row",
        marginTop: 20,
        justifyContent: "flex-end",
        paddingBottom: 20,
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
    goBackButton: {
        paddingVertical: 8,
        paddingHorizontal: 22,
        backgroundColor: colors.white,
        borderRadius: 25,
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
    closeConversationButton: {
        paddingVertical: 8,
        paddingHorizontal: 22,
        backgroundColor: colors.primary[500],
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
    },
    yesText: { width: "100%", color: colors.white, fontWeight: "600" },
    selectedButtonContainer: {
        backgroundColor: colors.primary[100],
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 2,
        borderRadius: 8,
        borderColor: colors.primary[500],
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 12,
    },
    nonSelectedButtonsContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 2,
        borderRadius: 8,
        borderColor: colors.gray.outline,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 12,
        position: "relative",
    },
    iconsMotive: { width: 20, height:20, marginRight: 20 },
    selectedButtonText: { fontWeight: "600", color: colors.primary[500] },
    nonSelectedButtonText: { color: colors.default },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        marginTop: 8,
        fontSize: 14,
        paddingVertical: 12,
        paddingHorizontal: 10,
        fontWeight: "500",
        color: colors.primary[500],
        paddingRight: 30, // to ensure the text is never behind the icon
        borderRadius: 12,
        borderColor: colors.gray.outline,
        backgroundColor: colors.white,
    },
    inputAndroid: {
        marginTop: 8,
        fontSize: 20,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderWidth: 0.5,
        borderRadius: 8,
        color: "black",
        paddingRight: 30, // to ensure the text is never behind the icon
        borderColor: colors.gray.outline,
        backgroundColor: colors.white,
    },
});
