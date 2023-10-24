import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React from "react";
import DoubleCheckIcon from "../icons/DoubleCheckIcon";
import { MESSAGE_STATUSES } from "../../constants/constants";
import CloseIcon from "../icons/CloseIcon";
import CheckmarkIcon from "../icons/CheckMarkIcon";

const StatusTick = ({ status, color }) => {
    switch (status) {
        case MESSAGE_STATUSES.CREATED:
            return <CheckmarkIcon style={{ width: "10px", height: "13px" }} />;
        case MESSAGE_STATUSES.DELIVERED_CHANNEL:
            return <CheckmarkIcon style={{ width: "15px", height: "15px" }} />;
        case MESSAGE_STATUSES.DELIVERED_USER:
            return <DoubleCheckIcon style={{ color, width: "16px", height: "16px" }} />;
        case MESSAGE_STATUSES.FAILED:
            return <CloseIcon style={{ color, width: "14px", height: "14px" }} />;
        default:
            return <ActivityIndicator style={{ marginHorizontal: 8 }} size={4} color="#00B3C7" />;
    }
};

export default StatusTick;
