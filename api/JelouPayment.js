import axios from "axios";
import axiosRetry from "axios-retry";

export const JelouPaymentAPI = axios.create({
    baseURL: process.env.REACT_APP_JELOU_PAYMENTS || "https://payments.jelou.ai/api/v1",
});

axiosRetry(JelouPaymentAPI, { retries: 3, retryDelay: axiosRetry.exponentialDelay });
