import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { memo, useState } from "react";
import { get, isEmpty, toUpper } from "lodash";
import dayjs from "dayjs";
import * as Clipboard from "expo-clipboard";
import { useSelector } from "react-redux";
import relativeTime from "dayjs/plugin/relativeTime";
import colors from "../../../constants/colors";
import EventBubble from "./Event";
import ContactBubble from "./Contact";
import "dayjs/locale/es";
import LocationBubble from "./Location";
import AudioBubble from "./Audio";
import StickerBubble from "./Sticker";
import TextBubble from "./Text";
import ImageBubble from "./Image";
import VideoBubble from "./Video";
import DocumentBubble from "./Document";
import QuickReplyBubble from "./QuickReplyBubble";
import StatusTick from "../../common/StatusTick";
import { TYPE_MESSAGE, USER_TYPES } from "../../../constants/constants";
import WarningIcon from "../../icons/WarningIcon";

dayjs.extend(relativeTime);

const Bubble = (props) => {
    const { bubble, prevBubble, setForwardModalVisibility } = props;
    const { by, createdAt, status = "" } = bubble;
    const message = get(bubble, "message", get(bubble, "bubble", {}));
    const userSession = useSelector((state) => state.userSession);
    const textError = get(message, "textError", "");
    const bubbleSenderName = get(bubble, "sender.name", get(bubble, "sender.names", ""));
    const prevBubbleType = get(prevBubble, "message.type", "");
    const previousSenderId = toUpper(prevBubbleType) !== "EVENT" ? get(prevBubble, "senderId", null) : null;
    const currentSenderId = get(bubble, "senderId", "");
    const currentOperatorId = get(bubble, "operatorId", "");
    const isSameSenderIdOfPreviousBubble = previousSenderId === currentSenderId || previousSenderId === currentOperatorId;

    const getTime = () => {
        const getFullTime = get(userSession.Company, "properties.pma.fullTime", false);
        const showAsRelativeTime = dayjs().diff(dayjs(createdAt), "hour") < 20;
        const showFullTime = dayjs().diff(dayjs(createdAt), "hour") > 24;

        if (getFullTime) {
            return dayjs(createdAt).format(`DD/MM/YY HH:mm`);
        }
        if (showFullTime) {
            return dayjs(createdAt).format(`DD/MM/YY HH:mm`);
        }
        if (showAsRelativeTime) {
            return dayjs().locale("es").to(dayjs(createdAt));
        }

        return dayjs(createdAt).format(`HH:mm`);
    };

    const type = get(message, "type", "");
    const time = getTime();

    const wrapperStyle = { ...styles.wrapper };
    const bubbleStyle = { ...styles.container };
    const textStyle = { ...styles.text };

    switch (toUpper(by)) {
        case USER_TYPES.BOT:
        case USER_TYPES.OPERATOR:
            wrapperStyle.justifyContent = "flex-end";
            bubbleStyle.backgroundColor = colors.primary[100];
            bubbleStyle.justifyContent = "center";
            bubbleStyle.borderTopRightRadius = 0;
            bubbleStyle.maxWidth = "80%";
            if (type !== TYPE_MESSAGE.EVENT) {
                bubbleStyle.shadowColor = "#000";
                bubbleStyle.shadowOpacity = 0.15;
                bubbleStyle.shadowRadius = 0.5;
                bubbleStyle.elevation = 4;
                bubbleStyle.shadowOffset = {
                    width: 0,
                    height: 1,
                };
            }
            break;
        case USER_TYPES.USER:
            wrapperStyle.justifyContent = "flex-start";
            bubbleStyle.backgroundColor = colors.gray[150];
            bubbleStyle.maxWidth = "80%";
            bubbleStyle.borderTopLeftRadius = 0;
            bubbleStyle.shadowColor = "#000";
            bubbleStyle.shadowOpacity = 0.15;
            bubbleStyle.shadowRadius = 0.5;
            bubbleStyle.elevation = 4;
            bubbleStyle.shadowOffset = {
                width: 0,
                height: 1,
            };
            break;
    }

    const copyToClipboard = async (text) => {
        await Clipboard.setStringAsync(text);
    };

    const headerBubble = () => {
        if (!isSameSenderIdOfPreviousBubble && !isEmpty(bubbleSenderName)) return <Text style={styles.textNameTitle}>{bubbleSenderName}</Text>;
    };

    const footerBubble = () => (
        <View style={styles.footerBubble}>
            <Text style={styles.timeStyle}>{time}</Text>
            {toUpper(by) === "USER" ? null : <StatusTick status={status} color={colors.default} />}
        </View>
    );

    const showBubble = () => {
        switch (toUpper(type)) {
            case TYPE_MESSAGE.TEXT:
                return (
                    <TextBubble
                        message={message}
                        parentBubbleStyle={bubbleStyle}
                        textStyle={textStyle}
                        by={by}
                        footerBubble={footerBubble}
                        headerBubble={headerBubble}
                        selectForward={selectForward}
                        copyToClipboard={copyToClipboard}
                    />
                );
            case TYPE_MESSAGE.IMAGE:
                return <ImageBubble message={message} parentBubbleStyle={bubbleStyle} footerBubble={footerBubble} headerBubble={headerBubble} />;
            case TYPE_MESSAGE.EVENT:
                return <EventBubble time={time} message={message} rawEvent={bubble} />;
            case TYPE_MESSAGE.VIDEO:
                return (
                    <VideoBubble
                        message={message}
                        parentBubbleStyle={bubbleStyle}
                        timeStyle={styles.timeStyle}
                        time={time}
                        footerBubble={footerBubble}
                        headerBubble={headerBubble}
                    />
                );
            case TYPE_MESSAGE.AUDIO:
                return (
                    <AudioBubble
                        bubble={bubble}
                        message={message}
                        parentBubbleStyle={bubbleStyle}
                        footerBubble={footerBubble}
                        headerBubble={headerBubble}
                    />
                );
            case TYPE_MESSAGE.LOCATION:
                return <LocationBubble message={message} footerBubble={footerBubble} headerBubble={headerBubble} />;

            case TYPE_MESSAGE.CONTACTS:
                return (
                    <ContactBubble
                        message={message}
                        parentBubbleStyle={bubbleStyle}
                        footerBubble={footerBubble}
                        headerBubble={headerBubble}
                        {...props}
                    />
                );

            case TYPE_MESSAGE.STICKER:
                return (
                    <StickerBubble
                        message={message}
                        bubbleSenderName={bubbleSenderName}
                        textNameTitle={styles.textNameTitle}
                        footerBubble={footerBubble}
                        headerBubble={headerBubble}
                    />
                );

            case TYPE_MESSAGE.DOCUMENT:
            case TYPE_MESSAGE.FILE:
                return (
                    <DocumentBubble
                        parentBubbleStyle={bubbleStyle}
                        message={message}
                        footerBubble={footerBubble}
                        headerBubble={headerBubble}
                        by={toUpper(by)}
                    />
                );
            case TYPE_MESSAGE.QUICK_REPLY:
                return (
                    <QuickReplyBubble
                        message={message}
                        parentBubbleStyle={bubbleStyle}
                        textStyle={textStyle}
                        by={by}
                        footerBubble={footerBubble}
                        headerBubble={headerBubble}
                        selectForward={selectForward}
                        copyToClipboard={copyToClipboard}
                    />
                );
            default: {
                return (
                    <TextBubble
                        bubble={bubble}
                        message={message}
                        parentBubbleStyle={bubbleStyle}
                        textStyle={textStyle}
                        by={by}
                        footerBubble={footerBubble}
                        headerBubble={headerBubble}
                        selectForward={selectForward}
                        copyToClipboard={copyToClipboard}
                    />
                );
            }
        }
    };

    const selectForward = (msg) => {
        setForwardModalVisibility({ showModal: true, message: bubble });
    };

    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            {!isEmpty(textError) && (
                <View>
                    <WarningIcon style={{ color: "#c53030", height: "25", width: "25", left: 140 }} />
                </View>
            )}
            <Pressable style={wrapperStyle}>{showBubble()}</Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 10,
        marginHorizontal: 20,
    },
    container: {
        backgroundColor: "white",
        borderWidth: 1,
        borderWidth: 0,
        paddingVertical: 4,
        paddingHorizontal: 4,
        borderRadius: 8,
        flexDirection: "column",
    },
    textNameTitle: { color: colors.primary[500], fontSize: 14, fontWeight: "600", padding: 4 },
    text: {
        fontSize: 14,
        color: colors.default,
        padding: 4,
    },
    timeStyle: { fontSize: 11, textAlign: "right", color: colors.default, fontFamily: "regular", marginTop: 5, marginBottom: 3, marginRight: 4 },
    footerBubble: { flexDirection: "row", alignItems: "center", justifyContent: "flex-end", marginRight: 4 },
    doubleCheckIcon: { width: 16, height: 16 },
});

export default memo(Bubble);
