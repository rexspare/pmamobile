// import * as Sentry from "@sentry/react";

import has from "lodash/has";
import get from "lodash/get";

import { v4 as uuidv4 } from "uuid";
import uuid from "react-native-uuid";

import JelouApiV1 from "../api/JelouApiV1";
import { useSelector } from "react-redux";
import { toLower } from "lodash";
import { uploadImages } from "../api/entities/bots";

export function useUploadFile(room) {
    const currentRoom = room;
    // const currentRoom = useSelector((state) => state.currentRoom);
    const { id: companyId } = useSelector((state) => state.company);

    const uploadFile = async (formData) => {
        const { appId: botId } = currentRoom;

        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
                // "Content-Type": "application/x-www-form-urlencoded",
            },
        };

        try {
            const data = await uploadImages({ botId, formData, config });
            return data;
        } catch (error) {
            console.log("something was wrong while uploading image", error);
            return error;
        }
    };

    const prepareAndUploadFile = async (file) => {
        const cleanFileName = file.name.replace(/ /g, "_");

        const fileName = uuid.v4() + `-${cleanFileName}`;
        // const fileName = `-${cleanFileName}`;
        const [typeFile] = file.type.split("/");
        // {dropzone}-COMPANY_ID/{image|video|document}/UUID.EXTENSION_ARCHIVO -> estructura del path
        const UUID = uuid.v4();
        const path = `dropzone-${companyId}/${typeFile}/${UUID}-${fileName}`;

        let formData = new FormData();
        formData.append("image", file);
        formData.append("path", path);

        const mediaUrl = await uploadFile(formData);
        return { mediaUrl };
    };

    const deleteFile = async ({ mediaUrl = null, currentRoom } = {}) => {
        if (!mediaUrl) {
            return Promise.reject("url is empty");
        }

        const {
            bot: { id = "" },
        } = currentRoom;
        const path = mediaUrl.split(".tech/")[1];

        const config = {
            // headers: {
            //     Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            // },
            data: { path },
        };

        return JelouApiV1.delete(`/bots/${id}/images`, config)
            .then(({ data }) => {
                return data.message[0];
            })
            .catch(() => {
                throw new Error("Error deleting file.");
            });
    };

    return { uploadFile, prepareAndUploadFile, deleteFile };
}

export default useUploadFile;
