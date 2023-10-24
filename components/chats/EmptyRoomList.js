import { StyleSheet, Text, View } from "react-native";
import React from "react";
import EmptyRoomsIcon from "../icons/EmptyRoomsIcon";
import colors from "../../constants/colors";
import { getTime } from "../../utils/helpers";
import dayjs from "dayjs";

const EmptyRoomList = ({ names }) => {
    const time = dayjs().locale("es").format("HH:mm");
    const greetings = getTime(time);

    return (
        <View style={styles.emptyListContainer}>
            <View style={styles.iconContainer}>
                <EmptyRoomsIcon />
            </View>
            <Text style={styles.headerText}>
                {greetings} {names}
            </Text>
            <Text style={styles.descriptionText}>Aún no tienes consultas entrantes</Text>
        </View>
    );
};

export default EmptyRoomList;

const styles = StyleSheet.create({
    emptyListContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    iconContainer: { marginVertical: 24 },
    headerText: { color: colors.default, fontSize: 18, fontWeight: "700", paddingVertical: 10 },
    descriptionText: { color: colors.gray[200], fontSize: 14 },
});
