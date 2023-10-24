import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { refreshAccessToken } from "../utils/helpers";
// import { Store } from "../store/store";

const JelouApiV1 = axios.create({
    baseURL: process.env.REACT_APP_JELOU_API || "https://api.jelou.ai/v1",
});

JelouApiV1.interceptors.request.use(async (config) => {
    const bearerToken = await AsyncStorage.getItem("@bearerToken");
    return {
        ...config,
        headers: {
            "Content-Type": config.headers["Content-Type"] || "application/json",

            "Accept-Language": "es",
            ...(config.Authorization ? { Authorization: config.Authorization } : { Authorization: `Bearer ${bearerToken}` }),
        },
    };
});

JelouApiV1.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (error.response?.status === 401) {
            try {
                // Refresh the access token
                const newAccessToken = await refreshAccessToken();

                // Update the Authorization header with the new access token
                error.config.headers.Authorization = `Bearer ${newAccessToken}`;

                // Retry the failed request with the new access token
                return axios.request(error.config);
            } catch (refreshError) {
                // Handle the error that occurred while refreshing the access token
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default JelouApiV1;
