/* import { ActivityIndicator, Modal, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import uuid from "react-native-uuid";
import "react-native-get-random-values";
import colors from "../../constants/colors";
import MoreIcon from "../icons/MoreIcon";
import QuickReplyIcon from "../icons/QuickReplyIcon";
import AttachMediaModal from "../modals/AttachMediaModal";
import { isEmpty, trim, get, toUpper } from "lodash";
import { DOCUMENT_MESSAGE_TYPES, FACEBOOK_MAX_LENGTH, INSTAGRAM_MAX_LENGTH, TYPE_MESSAGE, USER_TYPES } from "../../constants/constants";
import dayjs from "dayjs";
import { addMessage, updateMessage } from "../../reducers/messages";
import { useDispatch } from "react-redux";
import { sendOperatorsMessage } from "../../api/entities/operators";
import QuickReplyModal from "../modals/QuickReplyModal";
import SendOption from "./SendOption";

const InputRoom = (props) => {
    const { room, fileList, setFileList, navigation } = props;
    const [showAttachOptions, setShowAttachOptions] = useState(false);
    const [sendingImage, setSendingImage] = useState(false);
    const [sendingVideo, setSendingVideo] = useState(false);
    const [sendingAudio, setSendingAudio] = useState(false);
    const [sendingDocument, setSendingDocument] = useState(false);
    const [_document, setDocument] = useState({
        mediaUrl: "",
        type: "",
        mimeType: "",
        mediaName: "",
        file: "",
        path: "",
    });
    const [uploading, setUploading] = useState({});
    const [image, setImage] = useState({ imgUrl: "", file: "", path: "" });
    const [sendingMessage, setSendingMessage] = useState(false);
    const clearfileList = useCallback(() => {
        setFileList([]);
        setUploading({});
    }, []);

    const [messageText, setMessageText] = useState("");
    const isFacebookChat = toUpper(get(room, "source", "WEB")) === "FACEBOOK";
    const isInstagramChat = toUpper(get(room, "source", "WEB")) === "INSTAGRAM";
    const textMaxLength = isFacebookChat ? FACEBOOK_MAX_LENGTH : INSTAGRAM_MAX_LENGTH;
    const dispatch = useDispatch();

    const [showMic, setShowMic] = useState(true);
    const [recording, setRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const bottomSheetQuickReplyModalRef = useRef(null);
    const [loadingMessage, setLoadingMessage] = useState(false);

    const loadingsValues = Object.values(uploading);
    const hasSomeLoading = loadingsValues.some((value) => value === true);

    const cleaner = () => {
        setImage({
            imgUrl: "",
            file: "",
            path: "",
        });
        setMessageText("");
        setSendingDocument(false);
        setSendingImage(false);
        setSendingAudio(false);
    };

    const validateMessage = (message, ignoreText = false) => {
        const { text, type } = message;
        if (type !== TYPE_MESSAGE.TEXT) return true;
        if ((isFacebookChat || isInstagramChat) && text.length > textMaxLength) {
            console.log(`El mensaje es mayor a ${textMaxLength} caracteres`, MESSAGE_TYPES.ERROR);
            return false;
        }
        if (isEmpty(trim(messageText)) && !ignoreText) return false;
        return true;
    };

    const getFormMessage = (messageData, message) => {
        switch (toUpper(message.type)) {
            case TYPE_MESSAGE.TEXT:
                return {
                    ...messageData,
                    message: {
                        type: TYPE_MESSAGE.TEXT,
                        text: messageText,
                    },
                };
            case TYPE_MESSAGE.IMAGE:
                return {
                    ...messageData,
                    message: {
                        type: TYPE_MESSAGE.IMAGE,
                        mediaUrl: message.mediaUrl,
                        caption: messageText,
                        mimeType: image.type,
                    },
                };

            case TYPE_MESSAGE.DOCUMENT:
                return {
                    ...messageData,
                    message: {
                        type: TYPE_MESSAGE.DOCUMENT,
                        mediaUrl: message.mediaUrl,
                        mimeType: _document.mimeType,
                        caption: _document.mediaName,
                    },
                };
            case TYPE_MESSAGE.AUDIO:
                return {
                    ...messageData,
                    message: {
                        type: TYPE_MESSAGE.AUDIO,
                        mediaUrl: message.mediaUrl,
                    },
                };
            default:
                break;
        }
    };

    const createMessage = async (message, ignoreText = false) => {
        if (!validateMessage(message, ignoreText)) return;
        const { appId, source, id: roomId } = room;
        let { senderId } = room;
        const by = USER_TYPES.OPERATOR;

        const removePlus = source === "gupshup" || source === "wavy";

        if (removePlus) {
            senderId = senderId.replace("+", "");
        }

        let messageData = {
            appId,
            botId: appId,
            bubble: message,
            by,
            createdAt: dayjs().valueOf(),
            id: uuid.v4(),
            _id: id,
            roomId,
            senderId,
            source,
            userId: senderId,
        };

        // const formMessage = getFormMessage(messageData, message);

        try {
            const {
                data: { data },
            } = await sendOperatorsMessage(messageData);
            const { messageId } = data;
            console.log("data", data, messageId);

            dispatch(addMessage(messageData));
        } catch (err) {
            console.log("err", err);
            dispatch(
                updateMessage({
                    ...messageData,
                    status: "FAILED",
                })
            );
        }

        cleaner();
    };

    const sendMessage = async () => {
        setSendingMessage(true);
        const hasText = !isEmpty(trim(messageText));

        // if (!hasSomeLoading) {
        //     const doc = fileList[0];
        //     const { mediaUrl, type } = doc;

        //     const [typeFile] = type.split("/");

        //     const messageType = DOCUMENT_MESSAGE_TYPES[typeFile] ?? null;
        //     if (messageType) {
        //         const message = { mediaUrl, type: messageType, mimeType: type, caption: trim(text), width: 2 };

        //         await createMessage(message, true);
        //         clearfileList();
        //         setSendingMessage(false);

        //         return;
        //     }
        // }

        if (hasText) {
            const sendMessageText = () => {
                const message = { type: TYPE_MESSAGE.TEXT, text: messageText };
                createMessage(message);
            };
            sendMessageText();
            setSendingMessage(false);
        }
    };

    useEffect(() => {
        if (isEmpty(messageText) && !isRecording && !sendingImage) {
            setShowMic(true);
        } else {
            setShowMic(false);
        }
    }, [messageText, isRecording, sendingImage]);

    useEffect(() => {
        setLoadingMessage(sendingAudio || sendingDocument || sendingImage || sendingMessage);
    }, [sendingAudio, sendingDocument, sendingImage, sendingMessage]);

    return (
        <View style={styles.inputContainer}>
            <Modal transparent={true} visible={hasSomeLoading} style>
                <View
                    style={{
                        flex: 1,
                        bottom: 0,
                    }}>
                    <View
                        style={{
                            position: "absolute",
                            opacity: 0.7,
                            bottom: 0,
                            width: "100%",
                            height: 60,

                            backgroundColor: "white",
                        }}>
                        <ActivityIndicator size="large" color="##00B3C7" />
                    </View>
                </View>
            </Modal>
            <TouchableOpacity style={styles.mediaButton} onPress={() => setShowAttachOptions(true)}>
                <MoreIcon style={styles.inputIcons} />
            </TouchableOpacity>
            <AttachMediaModal
                setSendingDocument={setSendingDocument}
                _document={_document}
                setDocument={setDocument}
                uploading={uploading}
                setUploading={setUploading}
                image={image}
                setImage={setImage}
                setSendingImage={setSendingImage}
                sendingImage={sendingImage}
                sendMessage={sendMessage}
                fileList={fileList}
                setFileList={setFileList}
                room={room}
                showModal={showAttachOptions}
                closeModal={setShowAttachOptions}
            />
            <TouchableOpacity style={styles.mediaButton} onPress={() => bottomSheetQuickReplyModalRef.current?.present()}>
                <QuickReplyIcon style={styles.inputIcons} />
            </TouchableOpacity>
            <QuickReplyModal bottomSheetModalRef={bottomSheetQuickReplyModalRef} room={room} navigation={navigation} />
            <TextInput
                style={styles.textbox}
                placeholder="Escribe un mensaje"
                onChangeText={(text) => setMessageText(text)}
                value={messageText}
                onSubmitEditing={sendMessage}
            />
            <SendOption
                room={room}
                showMic={showMic}
                isRecording={isRecording}
                setRecording={setRecording}
                setIsRecording={setIsRecording}
                setElapsedTime={setElapsedTime}
                elapsedTime={elapsedTime}
                sendMessage={sendMessage}
                loadingMessage={loadingMessage}
                recording={recording}
                createMessage={createMessage}
                setSendingAudio={setSendingAudio}
            />
        </View>
    );
};

export default InputRoom;

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        paddingVertical: 5,
        paddingHorizontal: 6,
        height: 50,
        backgroundColor: "white",
        borderWidth: 1,
        borderRadius: 8,
        borderColor: colors.gray[100],
        backgroundColor: colors.gray[100],
        marginHorizontal: 10,
        marginVertical: 10,
        borderTopColor: colors.gray.outline,
    },
    inputIcons: {
        width: 30,
        height: 30,
    },
    textbox: {
        backgroundColor: colors.gray[100],
        marginHorizontal: 12,
        flex: 1,
    },
    mediaButton: {
        alignItems: "center",
        justifyContent: "center",
        width: 35,
    },
    containerIsRecording: {
        backgroundColor: colors.primary[100],
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 2,
        justifyContent: "space-evenly",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 2.52,

        elevation: 4,
    },
    containerTime: { paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-evenly" },
    recordingDot: { width: 10, height: 10, backgroundColor: "red", borderRadius: 20, alignSelf: "center" },
    recordingTime: { color: colors.default, textAlign: "center", marginHorizontal: 6 },
});
 */

import { ActivityIndicator, Modal, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import uuid from "react-native-uuid";
import colors from "../../constants/colors";
import MoreIcon from "../icons/MoreIcon";
import QuickReplyIcon from "../icons/QuickReplyIcon";
import AttachMediaModal from "../modals/AttachMediaModal";
import { isEmpty, trim, get, toUpper } from "lodash";
import { FACEBOOK_MAX_LENGTH, INSTAGRAM_MAX_LENGTH, TYPE_MESSAGE, USER_TYPES } from "../../constants/constants";
import dayjs from "dayjs";
import { addMessage, updateMessage } from "../../reducers/messages";
import { useDispatch } from "react-redux";
import { sendOperatorsMessage } from "../../api/entities/operators";
import QuickReplyModal from "../modals/QuickReplyModal";
import SendOption from "./SendOption";

const InputRoom = (props) => {
    const { room, fileList, setFileList, navigation } = props;
    const [showAttachOptions, setShowAttachOptions] = useState(false);
    const [sendingImage, setSendingImage] = useState(false);
    const [sendingVideo, setSendingVideo] = useState(false);
    const [sendingAudio, setSendingAudio] = useState(false);
    const [sendingDocument, setSendingDocument] = useState(false);
    const [_document, setDocument] = useState({
        mediaUrl: "",
        type: "",
        mimeType: "",
        mediaName: "",
        file: "",
        path: "",
    });
    const [uploading, setUploading] = useState({});
    const [image, setImage] = useState({ imgUrl: "", file: "", path: "" });
    const [sendingMessage, setSendingMessage] = useState(false);
    const clearfileList = useCallback(() => {
        setFileList([]);
        setUploading({});
    }, []);

    const [messageText, setMessageText] = useState("");
    const isFacebookChat = toUpper(get(room, "source", "WEB")) === "FACEBOOK";
    const isInstagramChat = toUpper(get(room, "source", "WEB")) === "INSTAGRAM";
    const textMaxLength = isFacebookChat ? FACEBOOK_MAX_LENGTH : INSTAGRAM_MAX_LENGTH;
    const dispatch = useDispatch();

    const [showMic, setShowMic] = useState(true);
    const [recording, setRecording] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const bottomSheetQuickReplyModalRef = useRef(null);
    const [loadingMessage, setLoadingMessage] = useState(false);

    const loadingsValues = Object.values(uploading);
    const hasSomeLoading = loadingsValues.some((value) => value === true);

    const cleaner = () => {
        setImage({
            imgUrl: "",
            file: "",
            path: "",
        });
        setMessageText("");
        setSendingDocument(false);
        setSendingImage(false);
        setSendingAudio(false);
    };

    const validateMessage = (message, ignoreText = false) => {
        const { text, type } = message;
        if (type !== TYPE_MESSAGE.TEXT) return true;
        if ((isFacebookChat || isInstagramChat) && text.length > textMaxLength) {
            console.log(`El mensaje es mayor a ${textMaxLength} caracteres`);
            return false;
        }
        if (isEmpty(trim(messageText)) && !ignoreText) return false;
        return true;
    };

    const getFormMessage = (messageData, message) => {
        switch (toUpper(message.type)) {
            case TYPE_MESSAGE.TEXT:
                return {
                    ...messageData,
                    message: {
                        type: TYPE_MESSAGE.TEXT,
                        text: messageText,
                    },
                };
            case TYPE_MESSAGE.IMAGE:
                return {
                    ...messageData,
                    message: {
                        type: TYPE_MESSAGE.IMAGE,
                        mediaUrl: message.mediaUrl,
                        caption: messageText,
                        mimeType: image.type,
                    },
                };

            case TYPE_MESSAGE.DOCUMENT:
                return {
                    ...messageData,
                    message: {
                        type: TYPE_MESSAGE.DOCUMENT,
                        mediaUrl: message.mediaUrl,
                        mimeType: _document.mimeType,
                        caption: _document.mediaName,
                    },
                };
            case TYPE_MESSAGE.AUDIO:
                return {
                    ...messageData,
                    message: {
                        type: TYPE_MESSAGE.AUDIO,
                        mediaUrl: message.mediaUrl,
                    },
                };
            default:
                break;
        }
    };

    const createMessage = async (message, ignoreText = false) => {
        if (!validateMessage(message, ignoreText)) return;
        const { appId, source, id: roomId } = room;
        let { senderId } = room;
        const by = USER_TYPES.OPERATOR;

        const removePlus = source === "gupshup" || source === "wavy";

        if (removePlus) {
            senderId = senderId.replace("+", "");
        }

        let messageData = {
            appId,
            botId: appId,
            bubble: message,
            by,
            createdAt: dayjs().valueOf(),
            id: uuid.v4(),
            roomId,
            senderId,
            source,
            userId: senderId,
        };

        try {
            const {
                data: { data },
            } = await sendOperatorsMessage(messageData);
            const { messageId } = data;
            console.log("data", data, messageId);

            dispatch(addMessage(messageData));
        } catch (err) {
            console.log("err", err);
            dispatch(
                updateMessage({
                    ...messageData,
                    status: "FAILED",
                })
            );
        }

        cleaner();
    };

    const sendMessage = async () => {
        setSendingMessage(true);
        const hasText = !isEmpty(trim(messageText));

        if (hasText) {
            const sendMessageText = () => {
                const message = { type: TYPE_MESSAGE.TEXT, text: messageText };
                createMessage(message);
            };
            sendMessageText();
            setSendingMessage(false);
        }
    };

    useEffect(() => {
        if (isEmpty(messageText) && !isRecording && !sendingImage) {
            setShowMic(true);
        } else {
            setShowMic(false);
        }
    }, [messageText, isRecording, sendingImage]);

    useEffect(() => {
        setLoadingMessage(sendingAudio || sendingDocument || sendingImage || sendingMessage);
    }, [sendingAudio, sendingDocument, sendingImage, sendingMessage]);

    return (
        <View style={styles.inputContainer}>
            <Modal transparent={true} visible={hasSomeLoading}>
                <View
                    style={{
                        flex: 1,
                        bottom: 0,
                    }}>
                    <View
                        style={{
                            position: "absolute",
                            opacity: 0.7,
                            bottom: 0,
                            width: "100%",
                            height: 60,

                            backgroundColor: "white",
                        }}>
                        <ActivityIndicator size="large" color="##00B3C7" />
                    </View>
                </View>
            </Modal>
            <TouchableOpacity style={styles.mediaButton} onPress={() => setShowAttachOptions(true)}>
                <MoreIcon style={styles.inputIcons} />
            </TouchableOpacity>
            <AttachMediaModal
                setSendingDocument={setSendingDocument}
                _document={_document}
                setDocument={setDocument}
                uploading={uploading}
                setUploading={setUploading}
                image={image}
                setImage={setImage}
                setSendingImage={setSendingImage}
                sendingImage={sendingImage}
                sendMessage={sendMessage}
                fileList={fileList}
                setFileList={setFileList}
                room={room}
                showModal={showAttachOptions}
                closeModal={setShowAttachOptions}
            />
            <TouchableOpacity style={styles.mediaButton} onPress={() => bottomSheetQuickReplyModalRef.current?.present()}>
                <QuickReplyIcon style={styles.inputIcons} />
            </TouchableOpacity>
            <QuickReplyModal bottomSheetModalRef={bottomSheetQuickReplyModalRef} room={room} navigation={navigation} />
            <TextInput
                style={styles.textbox}
                placeholder="Escribe un mensaje"
                onChangeText={(text) => setMessageText(text)}
                value={messageText}
                onSubmitEditing={sendMessage}
            />
            <SendOption
                room={room}
                showMic={showMic}
                isRecording={isRecording}
                setRecording={setRecording}
                setIsRecording={setIsRecording}
                setElapsedTime={setElapsedTime}
                elapsedTime={elapsedTime}
                sendMessage={sendMessage}
                loadingMessage={loadingMessage}
                recording={recording}
                createMessage={createMessage}
                setSendingAudio={setSendingAudio}
            />
        </View>
    );
};

export default InputRoom;

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        paddingVertical: 5,
        paddingHorizontal: 6,
        height: 50,
        backgroundColor: "white",
        borderWidth: 1,
        borderRadius: 8,
        borderColor: colors.gray[100],
        backgroundColor: colors.gray[100],
        marginHorizontal: 10,
        marginVertical: 10,
        borderTopColor: colors.gray.outline,
    },
    inputIcons: {
        width: 30,
        height: 30,
    },
    textbox: {
        backgroundColor: colors.gray[100],
        marginHorizontal: 12,
        flex: 1,
    },
    mediaButton: {
        alignItems: "center",
        justifyContent: "center",
        width: 35,
    },
    containerIsRecording: {
        backgroundColor: colors.primary[100],
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 2,
        justifyContent: "space-evenly",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 2.52,

        elevation: 4,
    },
    containerTime: { paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-evenly" },
    recordingDot: { width: 10, height: 10, backgroundColor: "red", borderRadius: 20, alignSelf: "center" },
    recordingTime: { color: colors.default, textAlign: "center", marginHorizontal: 6 },
});
