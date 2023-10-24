import { ActivityIndicator, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import colors from "../../constants/colors";
import MicIcon from "../icons/MicIcon";
import TrashIcon from "../icons/TrashIcon";
import { formatElapsedTime } from "../../utils/helpers";
import CheckIcon from "../icons/CheckIcon";
import SendIcon from "../icons/SendIcon";
import useUploadFile from "../../hooks/useUploadFile";
import { Audio } from "expo-av";
import { TYPE_MESSAGE } from "../../constants/constants";
import * as FileSystem from "expo-file-system";

const SendOption = (props) => {
    const {
        room,
        showMic,
        isRecording,
        setRecording,
        setIsRecording,
        setElapsedTime,
        elapsedTime,
        sendMessage,
        loadingMessage,
        recording,
        createMessage,
        setSendingAudio,
    } = props;
    const { uploadFile } = useUploadFile(room);

    useEffect(() => {
        let interval;
        if (isRecording) {
            interval = setInterval(() => {
                setElapsedTime((prevTime) => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => {
            clearInterval(interval);
        };
    }, [isRecording]);

    const startRecording = async () => {
        try {
            // Request audio permissions before starting recording
            Audio.requestPermissionsAsync();

            // Set audio mode to enable recording on iOS
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            // If a recording is in progress, stop and unload it first
            if (recording) {
                await recording.stopAndUnloadAsync();
            }

            const { recording: newRecording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);

            setRecording(newRecording);
            setIsRecording(true);
            setElapsedTime(0);
        } catch (error) {
            console.error("Failed to start recording", error);
        }
    };

 // get file name from uri
    const getFileNameFromURI = (uri) => { 
        const parts = uri.split("/");
        const fileName = parts[parts.length - 1];
    
        return fileName;
    };

    const stopRecording = async () => {
        try {
            if (!recording) {
                return;
            }
            // Stop the recording
            await recording.stopAndUnloadAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
            });
            setSendingAudio(true);

            const uri = recording.getURI();

            let uriParts = uri.split(".");
            let fileType = uriParts[uriParts.length - 1];

            if (Platform.OS !== "web") {
                //const fileInfo = await FileSystem.getInfoAsync(uri);
                const fileName = getFileNameFromURI(uri).split(".")[0];
                const path = `audio/${fileName}.${fileType}`;

                let formData = new FormData();
                formData.append("path", path);
                formData.append("image", {
                    uri,
                    name: `${fileName}.${fileType}`,
                    type: `audio/x-${fileType}`,
                });

                const urlFile = await uploadFile(formData);
                console.log("urlFile", urlFile);
                let message = { mediaUrl: urlFile, type: TYPE_MESSAGE.AUDIO };
                createMessage(message, true);
            } else {
                console.error("expo-file-system  no web");
            }

            setRecording(null);
            setIsRecording(false);
            setElapsedTime(0);
            setSendingAudio(false);
        } catch (error) {
            console.error("Failed to stop recording", error);
        }
    };

    const deleteRecording = async () => {
        try {
            if (recording) {
                await recording.deleteAsync();
                console.log("Recording deleted");
                setIsRecording(false);
                setElapsedTime(0);
            }
        } catch (error) {
            setIsRecording(false);
            console.error("Failed to delete recording", error);
        }
    };

    return (
        <>
            {showMic ? (
                <TouchableOpacity style={styles.mediaButton} onPress={isRecording ? null : startRecording}>
                    <MicIcon style={styles.inputIcons} />
                </TouchableOpacity>
            ) : isRecording ? (
                <View style={styles.containerIsRecording}>
                    <Pressable onPress={deleteRecording}>
                        <TrashIcon />
                    </Pressable>
                    <View style={styles.containerTime}>
                        <View style={styles.recordingDot} />
                        <Text style={styles.recordingTime}>{formatElapsedTime(elapsedTime)}</Text>
                    </View>
                    <Pressable onPress={stopRecording}>
                        <CheckIcon />
                    </Pressable>
                </View>
            ) : (
                <TouchableOpacity style={styles.mediaButton} activeOpacity={loadingMessage ? 1 : 0.2} disabled={loadingMessage} onPress={sendMessage}>
                    {loadingMessage ? <ActivityIndicator color={"white"} size={"small"} /> : <SendIcon style={styles.inputIcons} />}
                </TouchableOpacity>
            )}
        </>
    );
};

export default SendOption;

const styles = StyleSheet.create({
    mediaButton: {
        alignItems: "center",
        justifyContent: "center",
        width: 35,
    },
    inputIcons: {
        width: 30,
        height: 30,
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
