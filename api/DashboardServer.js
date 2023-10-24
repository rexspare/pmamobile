import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const DashboardServer = axios.create({
    baseURL: process.env.REACT_APP_DASHBOARD_SERVER_BASE_URL || "https://api.apps.jelou.ai/api",
});

DashboardServer.interceptors.request.use(async (config) => {
    const bearerToken = await AsyncStorage.getItem("@bearerToken");

    config.headers = {
        Authorization: `Bearer ${bearerToken}`,
        "Accept-Language": "es",
    };

    return config;
});

export default DashboardServer;