import { FlatList, Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import SendIcon from "../icons/SendIcon";
import colors from "../../constants/colors";
import SearchIcon from "../icons/SearchIcon";
import SourceType from "../common/SourceType";
import { useQueryClient } from "@tanstack/react-query";
import { FUSE_OPTIONS, ROOM_TYPES, TYPE_MESSAGE } from "../../constants/constants";
import CloseIcon from "../icons/CloseIcon";
import { get, isEmpty, toUpper } from "lodash";
import Fuse from "fuse.js";
import { sendOperatorsMessage } from "../../api/entities/operators";
import dayjs from "dayjs";
import { addMessage } from "../../reducers/messages";
import { useDispatch } from "react-redux";
import uuid from "react-native-uuid";
import ToastForward from ".././common/ToastForward";
import Toast from "react-native-toast-message";

const ForwardModal = (props) => {
    const { room, setForwardModalVisibility, forwardModalVisibility, navigation } = props;
    const queryClient = useQueryClient();
    const rooms = queryClient.getQueryData({ queryKey: ["rooms", ROOM_TYPES.CLIENT] }) || [];
    const message = forwardModalVisibility?.message;

    const [selectedRoom, setSelectedRoom] = useState({});
    const [searchRoom, setSearchRoom] = useState("");

    const detachOwnRoom = rooms.filter((_room) => _room.id !== room.id);
    const [clicked, setClicked] = useState(false);

    const dispatch = useDispatch();
    const [isToastVisible, setToastVisible] = useState(false);

    const closeForwardModal = () => {
        setForwardModalVisibility({ showModal: false, message: {} });
        setClicked(false);
        setSelectedRoom({});
        setSearchRoom("");
    };

    const getSearchedRoom = () => {
        if (isEmpty(searchRoom)) return detachOwnRoom;

        const fuse = new Fuse(detachOwnRoom, FUSE_OPTIONS);
        const result = fuse.search(searchRoom);
        let room = [];
        result.map((rooms) => {
            return room.push(rooms.item);
        });
        return room;
    };
    const sortRooms = getSearchedRoom();

    const forwardMessage = async () => {
        try {
            const { appId, id: roomId, senderId } = selectedRoom;
            const by = "operator";
            const source = get(room, "source", room.source);
            let messageData = {
                appId,
                senderId,
                by,
                source,
                roomId,
                createdAt: dayjs().valueOf(),
            };
            let mess = message?.message;
            switch (toUpper(mess?.type)) {
                case TYPE_MESSAGE.TEXT:
                    messageData = {
                        ...messageData,
                        message: {
                            type: "TEXT",
                            text: mess?.text,
                        },
                    };
                    break;
                case TYPE_MESSAGE.IMAGE:
                    messageData = {
                        ...messageData,
                        message: {
                            type: "IMAGE",
                            mediaUrl: mess?.mediaUrl,
                            caption: get(message, "message.caption", ""),
                            mimeType: mess?.mimeType,
                        },
                    };
                    break;
                case TYPE_MESSAGE.DOCUMENT:
                    messageData = {
                        ...messageData,
                        sid: senderId,
                        message: {
                            type: "DOCUMENT",
                            mediaUrl: mess?.mediaUrl,
                            mimeType: mess?.mimeType,
                            caption: get(message, "message.caption", ""),
                        },
                    };
                    break;
                case TYPE_MESSAGE.LOCATION:
                    messageData = {
                        ...messageData,
                        message: {
                            type: "LOCATION",
                            lat: Number(mess?.lat),
                            lng: Number(mess?.lng),
                        },
                    };
                    break;
                case TYPE_MESSAGE.AUDIO:
                    messageData = {
                        ...messageData,
                        message: {
                            type: "AUDIO",
                            mediaUrl: mess?.mediaUrl,
                            mimeType: mess?.mimeType,
                        },
                    };
                    break;
                case TYPE_MESSAGE.VIDEO:
                    messageData = {
                        ...messageData,
                        message: {
                            type: "VIDEO",
                            mediaUrl: mess?.mediaUrl,
                            mediaKey: mess?.mediaKey,
                            mimeType: mess?.mimeType,
                        },
                    };
                    break;
                default:
                    break;
            }

            if (toUpper(mess?.type) === "LOCATION") {
                mess = {
                    ...mess,
                    coordinates: {
                        lat: Number(mess?.lat),
                        long: Number(mess?.lng),
                    },
                };
            }

            //SEND MESSAGE
            const formMessage = {
                ...messageData,
                botId: appId,
                userId: senderId,
                bubble: mess,
                id: uuid.v4(),
                _id: uuid.v4(),
            };
            // Add message to Redux
            dispatch(addMessage(formMessage));

            // Send message to server
            await sendOperatorsMessage(formMessage);
            showCustomToast();
        } catch (error) {
            console.error("Error on send message", error);
        }
    };

    const showCustomToast = () => {
        setToastVisible(true);

        setTimeout(() => {
            closeForwardModal();
            navigation.navigate("RoomScreen", { room: selectedRoom });
            setToastVisible(false);
        }, 1000);
    };

    // const showCustomToast2 = () => {
    //     Toast.show({
    //         type: "success",
    //         text1: `Has reenviado un mensaje a ${selectedRoom.name} exitosamente`,
    //         visibilityTime: 2000, // Duración del Toast en milisegundos (4 segundos)
    //         autoHide: true,
    //     });
    // };

    return (
        <Modal animationType="none" transparent={true} visible={forwardModalVisibility?.showModal} onRequestClose={closeForwardModal}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Pressable style={styles.iconPosition} onPress={closeForwardModal}>
                        <CloseIcon />
                    </Pressable>
                    <SendIcon style={{ width: 40, height: 40, fill: "transparent", color: colors.primary[500] }} />
                    <View style={styles.containerHeaderText}>
                        <Text style={styles.headerText}>Reenviar mensaje</Text>
                    </View>
                    <Text style={styles.simpleText}>Selecciona la persona a la que deseas reenviar el mensaje</Text>

                    <View style={clicked ? styles.searchRoomClicked : styles.searchRoomUnclicked}>
                        <SearchIcon style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Buscar por nombre"
                            onChangeText={(text) => {
                                setSearchRoom(text);
                                setSelectedRoom({});
                            }}
                            onFocus={() => {
                                setClicked(true);
                            }}
                        />
                    </View>

                    <FlatList
                        data={sortRooms}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <Pressable
                                style={{ ...styles.botonList, backgroundColor: selectedRoom.id === item.id ? colors.primary[100] : colors.white }}
                                onPress={() => setSelectedRoom(item)}>
                                <SourceType style={styles.sourceTypeStyle} source={item.channelProvider} />
                                <View style={styles.containerInfo}>
                                    <Text numberOfLines={1} style={styles.textName}>
                                        {item?.name}
                                    </Text>
                                    <View style={styles.containerDetails}>
                                        <Text style={styles.senderId}>{item?.senderId}</Text>
                                        <View style={styles.clientView}>
                                            <Text style={styles.clientText}>Cliente</Text>
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                        )}
                        ListEmptyComponent={() => <Text style={styles.emptyList}>No hay destinatarios disponibles para reenviar el mensaje</Text>}
                    />

                    <View style={styles.buttonsContainer}>
                        <Pressable style={styles.cancelButton} onPress={closeForwardModal}>
                            <Text style={styles.cancelText}>Cancelar</Text>
                        </Pressable>
                        <Pressable
                            style={isEmpty(selectedRoom) ? styles.unactiveYesButton : styles.activeYesButton}
                            onPress={isEmpty(selectedRoom) ? null : forwardMessage}>
                            <Text style={isEmpty(selectedRoom) ? styles.unactiveYesButton.yesText : styles.activeYesButton.yesText}>Reenviar</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
            {isToastVisible && <ToastForward selectedRoom={selectedRoom} />}
            {/* <Toast ref={(ref) => Toast.setRef(ref)} /> */}
        </Modal>
    );
};

export default ForwardModal;

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        flex: 0,
        top: "10%",
        borderRadius: 16,
        padding: 22,
        backgroundColor: colors.white,
        margin: 25,
        maxHeight: "80%",
    },
    iconPosition: { flexDirection: "row", justifyContent: "flex-end" },
    containerHeaderText: { marginTop: 16, flexDirection: "row" },
    headerText: { color: colors.primary[500], fontSize: 18, fontWeight: "700", lineHeight: 22 },
    simpleText: { color: colors.default, marginVertical: 14, fontSize: 14 },
    sourceTypeStyle: { marginRight: 10 },

    searchRoomClicked: {
        padding: 10,
        flexDirection: "row",
        borderRadius: 10,
        borderColor: colors.primary[500],
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    searchRoomUnclicked: {
        padding: 10,
        flexDirection: "row",
        borderRadius: 10,
        borderColor: colors.gray.outline,
        borderWidth: 1,
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    searchIcon: {
        width: 18,
        height: 18,
    },
    searchInput: {
        fontSize: 15,
        marginLeft: 10,
        width: "90%",
        color: colors.secondary[100],
    },

    emptyList: { fontSize: 14, textAlign: "left", color: colors.default, fontWeight: "400", marginVertical: 16, lineHeight: 20 },
    buttonsContainer: {
        flexDirection: "row",
        marginVertical: 18,
        justifyContent: "flex-end",
    },
    cancelButton: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        backgroundColor: colors.white,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
    },
    cancelText: { color: colors.primary[500], fontWeight: "600" },
    activeYesButton: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        backgroundColor: colors.primary[500],
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        yesText: { color: colors.white, fontWeight: "600" },
    },
    unactiveYesButton: {
        backgroundColor: colors.gray[50],
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        yesText: { color: colors.default, fontWeight: "600" },
    },
    botonList: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: colors.gray.outline,
        paddingVertical: 10,
        marginVertical: 5,
        padding: 4,
    },
    containerInfo: { flexDirection: "column", flex: 1 },
    textName: { color: colors.default, fontSize: 16, fontWeight: "600" },
    containerDetails: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
    senderId: { color: colors.default, fontSize: 13, fontWeight: "400" },
    clientView: {
        backgroundColor: colors.primary[100],
        borderRadius: 25,
        paddingHorizontal: 10,
        paddingVertical: 2,
    },
    clientText: { color: colors.primary[500], fontSize: 13 },
});
