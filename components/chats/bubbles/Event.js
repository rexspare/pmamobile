import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { get, toUpper } from "lodash";
import colors from "../../../constants/colors";
import CalendarEventIcon from "../../icons/CalendarEventIcon";

 const EventBubble = (props) => {
 
    const { message, rawEvent, time } = props;
    const slug = get(message, "slug");

    // const { description = "", slug = "", type = "" } = event;

    const checkIfShouldRenderEvent = () => {
        switch (toUpper(slug)) {
            case "TIME_WAIT":
            case "EXTEND_TIME":
            case "TYPING_WITHOUT_ASSIGNATION":
            case "CHANGE_STATUS":
            case "SWITCH_OPERATOR_TO":
            case "INPUT":
                return false;
            default:
                return true;
        }
    };

    const getMessage = () => { 
        switch (toUpper(slug)) { 
            case "ASSIGNED":
                return `Asignado a ${get(rawEvent, "sender.names", "")}`;
            case "TIME_END":
                return `Conversación expirada`;
            case "REMOVE_USER":
                return `Conversación finalizada`;
            case "SWITCH_OPERATOR_FROM":
                // return `${t("pma.transferedTo")} ${get(rawEvent, "message.newOperator.names", get(rawEvent, "bubble.newOperator.names", ""))}`;
                return `Transferido a ${get(rawEvent, "message.newOperator.names", get(rawEvent, "bubble.newOperator.names", ""))}`;
            case "INDUCED_BY_OPERATOR":
                return `Inducido por operador`;
            case "PREVIOUS_ASSIGNATION":
                return `Cliente regresa`;
            case "QUEUE_ASSIGNED":
                // return `${t("pma.queueAssigned")} - ${get(rawEvent, "message.queue", get(rawEvent, "bubble.queue", t("pma.unknown")))}`;
                return `Entró a cola - ${get(rawEvent, "message.queue", get(rawEvent, "bubble.queue", "Desconocido"))}`;
            case "INDUCED_BY_ADMIN":
                return `Inducido por monitor`;
            case "INDUCED_BY_SYSTEM":
                return `Inducido por sistema`;
            case "TICKET_ASSIGNATION":
                return `Ingreso desde Cola de atención`;
            default:
                return get(rawEvent, "message.description", get(rawEvent, "bubble.description", "Sin Descripción"));
        }
    };

    const shouldRenderEvent = checkIfShouldRenderEvent();

    if (!shouldRenderEvent) {
        return null;
    }

    return (
        <View style={styles.containerEvent}>
            <View style={styles.lineStyleLeft} />
            <View style={styles.eventInfo}>
                <CalendarEventIcon style={styles.calendIcon} />
                <Text style={styles.messageEvent}>{getMessage()}</Text>
                <Text style={styles.time}>{time}</Text>
            </View>
            <View style={styles.lineStyleRight} />
        </View>
    );
};

export default EventBubble;

const styles = StyleSheet.create({
    containerEvent: { alignItems: "center", justifyContent: "center", flexDirection: "row", width: "90%", flex: 1 },
    lineStyleLeft: { flex: 1, height: 0.75, backgroundColor: colors.gray[100], marginRight: 6 },
    lineStyleRight: { flex: 1, height: 0.75, backgroundColor: colors.gray[100], marginLeft: 6 },
    eventInfo: {
        flexDirection: "row",
        padding: 4,
        paddingHorizontal: 12,
        borderRadius: 4,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.gray[100],
    },
    calendIcon: { width: 15, height: 15 },
    messageEvent: { fontSize: 12, color: colors.default, paddingHorizontal: 10 },
    time: { fontSize: 12, color: colors.default, fontStyle: "italic" },
});
