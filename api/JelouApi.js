import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const JelouApiPma = axios.create({
    baseURL: process.env.REACT_APP_JELOU_API_BASE || "https://api.jelou.ai",
});

JelouApiPma.interceptors.request.use(async (config) => {
    const bearerToken = await AsyncStorage.getItem("@bearerToken");

    config.headers = {
        Authorization: `Bearer ${bearerToken}`,
    };

    return config;
});
