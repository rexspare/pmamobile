import Immutable, { List } from "immutable";
import get from "lodash/get";
import omit from "lodash/omit";
import castArray from "lodash/castArray";
import isArray from "lodash/isArray";
import dayjs from "dayjs";
import { isEmpty, toNumber } from "lodash";
import { CHANNELS_VIDEO_SUPORT, DOCUMENT_MESSAGE_TYPES, unitInMB, OPERATOR_STATUS } from "..//constants/constants";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DashboardServer from "../api/DashboardServer";

/* FILE SIZES */
export const MAX_SIZE = "25000"; // 25Mb
export const MAX_SIZE_MB = 25; // 25Mb -> defatult
export const MAX_SIZE_MB_WHATSAPP = 16; // 16Mb
export const MAX_SIZE_MB_DOCUMENTS = 90; // 90Mb

const SOURCE_SUPPORT_EXTRA_SIZE = {
    gupshup: "gupshup",
    web: "web",
};

export const keyById = function keyById(data, key = null) {
    if (!Array.isArray(data)) {
        data = [data];
    }

    data = data.map((item) => {
        return {
            ...item,
        };
    });

    return Immutable.fromJS(data)
        .toMap()
        .mapEntries(function ([, value]) {
            return [value.get(key || "id"), value];
        });
};

export function filterByKey(data, key, value) {
    if (!isArray(data)) {
        return [];
    }
    return data.filter((item) => item[key] === value);
}

export const mergeById = function mergeById(state, payload, key = null) {
    const arr = castArray(payload);
    return keyById(state, key).merge(keyById(arr, key)).toList().toJS();
};

export const updateById = function updateById(arr = [], obj, key = "id") {
    return List(arr)
        .map((item) => {
            if (item[key] === obj[key]) {
                return { ...item, ...obj };
            }
            return item;
        })
        .toJS();
};

export const updateByIdSortByDate = function updateByIdSortByDate(arr = [], obj) {
    let modifiedIndex = -1;
    const updatedList = List(arr)
        .map((item, index) => {
            if (item.id === obj.id) {
                modifiedIndex = index;
                return { ...item, ...obj };
            }
            return item;
        })
        .toJS();
    if (modifiedIndex !== -1) {
        const updatedElement = updatedList.splice(modifiedIndex, 1);
        return [...updatedElement, ...updatedList];
    }
    return updatedList;
};

export function parseRoom(roomData) {
    // console.log("roomData", roomData);
    // const storageKey = `room:${roomData.id}`;
    // const lastUnRead = sessionStorage.getItem(storageKey) || 1;
    const lastUnRead = 0;
    const unreadCount = Number(lastUnRead);
    // sessionStorage.setItem(storageKey, unreadCount);
    const metaInfo = roomData?.membersInfo || [];

    const user = metaInfo.find((member) => member.memberType === "user");

    const room = {
        users: roomData.members,
        name: roomData.name,
        info: roomData.info,
        ...roomData,
        lastMessageAt: roomData.lastMessageAt,
        unreadCount,
        id: roomData.id,
        source: roomData.channelProvider,
        senderId: user.id,
        appId: roomData.bot.id,
        metadata: roomData.metadata,
        user,
    };

    if (room.source === "wavy") {
        try {
            room.senderId = room.senderId.replace("+", "");
        } catch (error) {
            console.log(error);
        }
    }

    const messages = [];
    const roomMessages = get(room, "messages", []);

    if (roomMessages?.$each) {
        for (const message of roomMessages.$each) {
            messages.push(parseMessage(message));
        }
    } else {
        for (const message of roomMessages) {
            messages.push(parseMessage(message));
        }
    }
    // room.messages = messages.filter((message) => !message.event);

    return room;
}

export function parseMessage(msg) {
    const message = msg.bubble;
    const messageData = omit(msg, "bubble");
    const createdAt = dayjs(msg.createdAt).valueOf();

    const messageModel = {
        ...messageData,
        message,
        createdAt,
        id: msg.messageId,
    };

    return messageModel;
}

export function getName(room, user) {
    if (!isEmpty(room?.name)) {
        return get(room, "name", "Desconocido");
    }
    if (!isEmpty(room?.sidebarData?.name)) {
        return get(room, "sidebarData.name", "Desconocido");
    }
    if (!isEmpty(room?.metadata?.names)) {
        return get(room, "metadata.names", "Desconocido");
    }
    if (!isEmpty(user?.name)) {
        return get(user, "name", "Desconocido");
    }
    if (!isEmpty(user?.names)) {
        return get(user, "names", "Desconocido");
    }
    return "Desconocido";
}

export function validateFile({ fileList = [], file = {}, t, ACCEPTED = {}, currentRoom = {}, skipExtensionValidation = false } = {}) {
    console.log("validateFile", { fileList, file, t, ACCEPTED, currentRoom, skipExtensionValidation });
    const isExists = fileList.some((doc) => doc.name === file.name);
    if (isExists) {
        // Alert.alert(
        //     "File Exists", // title
        //     "This already exists" // message
        //       [
        //          {
        //              text: "Cancel",
        //              onPress: () => console.log("Cancel Pressed"),
        //              style: "cancel",
        //          },
        //          { text: "OK", onPress: () => console.log("OK Pressed") },
        //      ]
        // );
        renderMessage(`${file.name} ${t("pma.thisFileExists")}`, "error");
        return { hasError: true };
    }

    

    const [typeFile, extension] = file.type.split("/");
    console.log("line 187", { typeFile, extension, file, type: ACCEPTED[typeFile] || ACCEPTED.document });
    const { type, accept: acceptances } = ACCEPTED[typeFile] || ACCEPTED.document;
    console.log("line 189", { type, accept: acceptances });
    const { channel = "", source = "" } = currentRoom;

    console.error({ acceptances, extension, typeFile, validation: acceptances.includes(extension) }, "for testing");

    if (!skipExtensionValidation && !acceptances.includes(extension)) {
        Alert.alert(
            "File type error", //title
            "This file extension is not supported" //message
        );
        console.error({ acceptances, extension, typeFile, validation: !acceptances.includes(extension) });
        return { hasError: true };
    }

    const getMaxSize = ({ channel = "", source = "", type = "" } = {}) => {
        const sourceSupport = String(source).toLowerCase();

        if (type === DOCUMENT_MESSAGE_TYPES.document && SOURCE_SUPPORT_EXTRA_SIZE[sourceSupport]) {
            return MAX_SIZE_MB_DOCUMENTS;
        }
        console.log("209 line, channel", channel);
        console.log("line 211", type, DOCUMENT_MESSAGE_TYPES, CHANNELS_VIDEO_SUPORT);
        console.log("is true?", type === DOCUMENT_MESSAGE_TYPES.video && channel.toUpperCase() === CHANNELS_VIDEO_SUPORT.WHATSAPP);
        if (type === DOCUMENT_MESSAGE_TYPES.video && channel.toUpperCase() === CHANNELS_VIDEO_SUPORT.WHATSAPP) {
            return MAX_SIZE_MB_WHATSAPP;
        }

        return MAX_SIZE_MB;
    };
    console.log("line 215");
    console.log("Channel, source, type", { channel, source, type });
    const maxSize = getMaxSize({ channel, source, type });
    console.log("file in validateFile", file);
    console.log("unitInMB", unitInMB);
    console.log("final file size", (file.size / unitInMB).toFixed(0));

    const sizeOfFile = toNumber((file.size / unitInMB).toFixed(0));
    console.log("MaxSize, sizeOfFile", { maxSize, sizeOfFile });
    if (sizeOfFile > maxSize) {
        console.log("line 225 error file size");
        Alert.alert(
            "File size error", // title
            "The file size has been exceed" // message
        );
        console.error({ file, currentSize: sizeOfFile > maxSize });
        return { hasError: true };
    }

    return { hasError: false };
}

export function milisecondsToTimestamp(miliseconds) {
    let seconds = Math.floor(miliseconds / 1000);
    let h = Math.floor(seconds / 3600);
    let m = Math.floor((seconds - h * 3600) / 60);
    let s = seconds - h * 3600 - m * 60;

    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    return m + ":" + s;
}

export function operatorStatusColor(operatorActive) {
    return operatorActive === OPERATOR_STATUS.ONLINE
        ? "#18BA81"
        : operatorActive === OPERATOR_STATUS.OFFLINE
        ? "#F95A59"
        : operatorActive === OPERATOR_STATUS.BUSY
        ? "#F3AF40"
        : "#B0B6C2";
}

export function getTime(time) {
    if (time < "12:00") {
        return "Buenos días";
    } else if (time >= "12:00" && time < "19:00") {
        return "Buenas tardes";
    } else if (time >= "19:00") {
        return "Buenas noches";
    }
}

export const updateIdById = function updateById(arr = [], obj, key) {
    return List(arr)
        .map((item) => {
            if (item.id === obj[key]) {
                return { ...item, ...obj };
            }
            return item;
        })
        .toJS();
};

export const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export const formatElapsedTime = (time) => {
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
};

export const previewMessageFormat = (body, params, paramsValue) => {
    const parseTemplate = () => {
        let tempString = body;
        if (!isEmpty(params)) {
            params.forEach((param) => {
                tempString = tempString.replace(`{{${param.param}}}`, paramsValue[param.label] || `{{${param.param}}}`);
            });
            return tempString;
        }
        return body;
    };
    return parseTemplate();
};

export const refreshAccessToken = async () => {
    try {
        // Retrieve the refresh token from storage
        const refreshToken = await AsyncStorage.getItem("@refreshToken");

        // Make a request to the server with the refresh token to obtain a new access token
        // ...
        const { data } = await DashboardServer.get("/auth/login/refreshToken", { headers: { Authorization: `Bearer ${refreshToken}` } });
        const token = get(data, "data.token", "");
        const newRefreshToken = get(data, "data.refreshToken", "");

        // If the request is successful, update the access token in AsyncStorage
        await AsyncStorage.setItem("@bearerToken", token);
        await AsyncStorage.setItem("@refreshToken", newRefreshToken);

        // Return the new access token
        return newRefreshToken;
    } catch (err) {
        console.error("Error al obtener token actualizado", err);
        const {
            response: { status = 0 },
        } = err;
        if (status === 401) {
            await AsyncStorage.removeItem("@refreshToken", token);
            await AsyncStorage.removeItem("@bearerToken", newRefreshToken);
        }
    }
};
