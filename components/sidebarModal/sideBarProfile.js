import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import dayjs from "dayjs";
import "dayjs/locale/es";
import ProfileList from "./profileList";
import colors from "../../constants/colors";

const SidebarProfile = (props) => {
    const { roomInfo } = props;
    const channel = useSelector((state) => state.sidebarChannel);
    const [clientInfoExpanded, setClientInfoExpanded] = useState(false);
    const [conversationInfoExpanded, setConversationInfoExpanded] = useState(false);
    const channelId = get(roomInfo, "metadata.id", "");
    const name = get(roomInfo, "metadata.names", "");
    const createdAt = get(roomInfo, "createdAt", "");
    const firstInteraction = dayjs(createdAt).locale("es").format("DD/MM/YYYY - HH:mm:ss", "es");
    let username = get(roomInfo, "metadata.username", "");
    if (!isEmpty(username)) username = `@${username}`;

    const clientParams = [
        { title: "ID en canal", body: channelId, id: "channelId" },
        { title: "Nombre", body: name, id: "name" },
        { title: "Nombre del usuario", body: username, id: "username" },
    ];
    const conversationParams = [
        { title: "Canal", body: channel, id: "channel" },
        { title: "Primera interacción", body: firstInteraction, id: "createdAt" },
    ];

    const toggleClientInfoExpanded = () => {
        setClientInfoExpanded(!clientInfoExpanded);
    };

    const toggleConversationInfoExpanded = () => {
        setConversationInfoExpanded(!conversationInfoExpanded);
    };

    return (
        <View style={styles.container}>
            <ProfileList
                onPressFunction={toggleClientInfoExpanded}
                icon={"client"}
                title={"Información del cliente"}
                renderVariable={clientInfoExpanded}
                dataToRender={clientParams}
            />
            <ProfileList
                onPressFunction={toggleConversationInfoExpanded}
                icon={"conversation"}
                title={"Información de la conversación"}
                renderVariable={conversationInfoExpanded}
                dataToRender={conversationParams}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        backgroundColor: colors.white,
    },
});

export default SidebarProfile;
