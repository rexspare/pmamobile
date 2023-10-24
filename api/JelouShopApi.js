import axios from "axios";

export const JelouShopApi = axios.create({
    baseURL: process.env.REACT_APP_JELOU_SHOP_API || "https://ecommerce.jelou.ai/api/v1",
});

JelouShopApi.interceptors.request.use((config) => {
    return {
        ...config,
        headers: {
            "Accept-Language": "es",
            "Content-Type": "application/json",
        },
    };
});
