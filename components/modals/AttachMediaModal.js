import React, { useCallback, useState } from "react";
import { Modal, Platform, StyleSheet, View, Text, Pressable, TouchableOpacity, Button, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker/src/ImagePicker";
import * as DocumentPicker from "expo-document-picker";
import uuid from "react-native-uuid";

import colors from "../../constants/colors";
import FolderIcon from "../icons/FolderIcon";
import ImageIcon from "../icons/ImageIcon";
import VideoIcon from "../icons/VideoIcon";
import useAcceptance from "../../hooks/useAcceptace";
import { validateFile } from "../../utils/helpers";
import useUploadFile from "../../hooks/useUploadFile";

import { DOCUMENT_MESSAGE_TYPES, FACEBOOK_MAX_LENGTH, INSTAGRAM_MAX_LENGTH } from "../../constants/constants";
import toLower from "lodash/toLower";
import trim from "lodash/trim";
import toUpper from "lodash/toUpper";
import get from "lodash/get";
import { useEffect } from "react";
import * as FileSystem from "expo-file-system";
import { set } from "lodash";

const AttachMediaModal = (props) => {
    const {
        showModal,
        setUploading,
        uploading,
        room,
        closeModal,
        image,
        setImage,
        setSendingImage,
        sendingImage,
        sendMessage,
        fileList,
        setFileList,
        _document,
        setDocument,
        setSendingDocument,
    } = props;

    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
    const { documentAcceptance, imageAcceptance, videoAcceptance } = useAcceptance(room);
    const { prepareAndUploadFile, deleteFile } = useUploadFile(room);
    const ACCEPTED = {
        image: { type: DOCUMENT_MESSAGE_TYPES.image, accept: imageAcceptance() },
        video: { type: DOCUMENT_MESSAGE_TYPES.video, accept: videoAcceptance() },
        document: { type: DOCUMENT_MESSAGE_TYPES.document, accept: documentAcceptance() },
    };

    const addFileToList = ({ file = null, fileList = [], type = null } = {}) => {
        if (!file) return;

        const parsedFile = () => {
            if (type === "document") {
                return {
                    uri: file.uri,
                    name: file.name,
                    type: `document/${file.uri.split(".").pop()}`,
                };
            } else {
                return {
                    uri: file.uri,
                    name: file.uri.split("/").pop(),
                    type: toLower(`${file.type}/${file.uri.split(".").pop()}`),
                };
            }
        };

        const { hasError } = validateFile({
            fileList,
            file: parsedFile(),
            ACCEPTED,
            currentRoom: room,
        });

        if (hasError) {
            return;
        }

        setUploading((prevState) => ({
            ...prevState,
            [file.uri]: true,
        }));

        setFileList((prevState) => [...prevState, parsedFile()]);

        prepareAndUploadFile(parsedFile()).then(({ mediaUrl }) => {
            setFileList((prevState) => {
                return prevState.map((doc) => {
                    if (doc.uri === file.uri) {
                        return { ...doc, mediaUrl };
                    }
                    return doc;
                });
            });

            if (type === "document") {
                setSendingDocument(true);
                setDocument((prevState) => ({
                    ...prevState,
                    type: "document",
                    mimeType: file.type,
                    mediaName: file.name,
                    file,
                    path: `document/${file.name}`,
                }));
            }

            setUploading((prevState) => ({
                ...prevState,
                [file.uri]: false,
            }));
        });
    };

    const pickFile = async (type) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("Lo sentimos, necesitamos permisos para acceder a la galería.");
            return;
        }

        const mediaTypes =
            type === "video" ? ImagePicker.MediaTypeOptions.Videos : type === "image" ? ImagePicker.MediaTypeOptions.Images : undefined;

        let result;
        if (type === "document") {
            result = await DocumentPicker.getDocumentAsync({});
        } else {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                ...(type === "video" ? { aspect: [4, 3] } : {}),
                quality: 1,
            });
            console.log("RESULTTTT",result)
        }

        closeModal(false);
        setSendingImage(true);

        const fileType = type === "document" ? "document" : type === "image" ? "image" : "video";
        addFileToList({ file: result, type });

        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showModal}
            onRequestClose={() => {
                setModalVisible(!showModal);
            }}>
            <View style={styles.backgroundModal}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={() => pickFile("video")} style={styles.attachment_button}>
                        <VideoIcon />
                        <Text style={styles.text}>Video</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => pickFile("image")} style={styles.attachment_button}>
                        <ImageIcon />
                        <Text style={styles.text}>Imagen</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => pickFile("document")} style={styles.attachment_button_last}>
                        <FolderIcon />
                        <Text style={styles.text}>Documento</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => closeModal(false)} style={styles.cancelButton}>
                    <Text style={styles.cancelText}>Cancelar</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

export default AttachMediaModal;

const styles = StyleSheet.create({
    backgroundModal: {
        backgroundColor: "rgba(0,0,0,0.5)",
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        paddingBottom: 35,
    },
    container: {
        backgroundColor: "white",
        width: "90%",
        borderRadius: 10,
    },
    attachment_button: {
        flexDirection: "row",
        gap: 14,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderColor: colors.gray.outline,
        alignItems: "center",
    },
    attachment_button_last: {
        flexDirection: "row",
        gap: 14,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: "center",
    },
    text: {
        color: colors.default,
    },
    cancelButton: {
        width: "90%",
        height: 40,
        backgroundColor: colors.primary[500],
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },

    cancelText: {
        color: "white",
    },
});
