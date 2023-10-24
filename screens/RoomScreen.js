import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, ImageBackground, KeyboardAvoidingView, Platform, FlatList, Pressable, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { first, get, isEqual, last, sortBy } from "lodash";
import isEmpty from "lodash/isEmpty";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import Validator from "validatorjs";
import es from "validatorjs/src/lang/es";
import en from "validatorjs/src/lang/en";
import colors from "../constants/colors";
import sizes from "../constants/sizes";
import InputRoom from "../components/chats/InputRoom";
import BubbleContainer from "../components/chats/bubbles/BubbleContainer";
import SidebarModal from "../components/sidebarModal";
import Bubble from "../components/chats/bubbles/Bubble";
import ScrollDownIcon from "../components/icons/ScrollDownIcon";
import RoomHeader from "../components/chats/RoomHeader";
import { useStoredParams } from "../api/query/useStoredParams";
import { getRoomMessages } from "../api/entities/rooms";
import { addMessage } from "../reducers/messages";
import { UrlPreview } from "../components/chats/UrlPreview";
import RoomScreenSkeleton from "../components/skeleton/RoomScreenSkeleton";
import { setSidebarChanged } from "../reducers/sidebarChanged";
import { setVerifyStatus } from "../reducers/verifyStatus";
import ForwardModal from "../components/modals/ForwardModal";
import { filterByKey } from "../utils/helpers";

const RoomScreen = (props) => {
    const { route, navigation } = props;
    const { params } = route;
    const { room = {}, isRefetchingMessages } = params;
    const userSession = useSelector((state) => state.userSession);
    const teams = useSelector((state) => state.teams);
    const company = useSelector((state) => state.company);
    const tags = useSelector((state) => state.tags);
    const [scrollButton, showScrollButton] = useState(false);
    const scrollRef = useRef(null);
    const bottomSheetModalRef = useRef(null);
    const [fileList, setFileList] = useState([]);

    const dispatch = useDispatch();
    const messages = useSelector((state) => state.messages);
    const bots = useSelector((state) => state.bots);
    const [bot, setBot] = useState({});
    const [forwardModalVisibility, setForwardModalVisibility] = useState({ showModal: false, message: {} });

    const getFilteredMessages = () => {
        let filteredMessages = filterByKey(messages, "roomId", room?.id);
        filteredMessages = sortBy(filteredMessages, (data) => dayjs(data.createdAt)).reverse();
        return filteredMessages;
    };

    const sortedMessages = getFilteredMessages();

    const { data: storedParamsData } = useStoredParams({ botId: room?.appId, userId: room?.senderId });
    const [storedParams, setStoredParams] = useState({});

    useEffect(() => {
        if (!isEmpty(storedParamsData)) setStoredParams(storedParamsData);
    }, [storedParamsData]);

    const [scrollToBottomClicked, setscrollToBottomClicked] = useState(false);

    const loadMoreMessages = async () => {
        console.log("cargando mas mensajes:");
        const getEarlyMessage = last(sortedMessages);
        if (isEmpty(room)) return;
        const options = { roomId: room?.id, limit: 20, _id: getEarlyMessage._id };
        const data = await getRoomMessages(options);
        dispatch(addMessage(data));
    };

    //go to the bottom
    const handleScroll = (event) => {
        const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
        const isAtTop = contentOffset.y === 0;
        const isAtBottom = contentOffset.y + layoutMeasurement.height === contentSize.height;
        if (isAtTop) {
            showScrollButton(false);
        } else {
            showScrollButton(true);
        }
        //showScrollButton(!isAtBottom);
    };

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollToOffset({ offset: 0, animated: true });
            setscrollToBottomClicked(false);
        }    };

    // useEffect(() => {
    //     setBot(bots.find((bot) => bot.id === room.bot?.id));
    // }, [bots]);

    useEffect(() => {
        if (!isEmpty(room) && !isEmpty(bots)) {
            setBot(bots.find((bot) => bot.id === room.appId));
        }
    }, [bots, room]);

    const getSideBarSettings = useCallback(() => {
        const teamId = first(get(userSession, "teams", []));
        const teamObj = teams.find((team) => team.id === teamId);
        const teamSettingsLegacy = get(teamObj, "properties.sidebar_settings", []);
        const teamSettings = get(teamObj, "properties.sidebarSettings", []);

        const botSettings = get(bot, "properties.sidebar_settings", []);
        const companySettings = get(company, "properties.sidebar_settings", []);

        if (!isEmpty(teamSettingsLegacy)) {
            return teamSettingsLegacy;
        }
        if (!isEmpty(teamSettings)) {
            return teamSettings;
        }
        if (!isEmpty(botSettings)) {
            return botSettings;
        }
        if (!isEmpty(companySettings)) {
            return companySettings;
        }
        return [];
    }, [userSession, teams, bot, company]);

    const sidebarSettings = getSideBarSettings();
    const hasSidebarSettingsEnabled = !isEmpty(sidebarSettings) || !isEmpty(tags);

    const getVerify = (settings) => {
        const rulesArray = {};
        const dataArray = {};
        const errorArray = {};
        const dataErrorArray = {};
        const dependantArray = [];

        if (settings && settings.length > 0) {
            settings.forEach((setting) => {
                const isObligatory = get(setting, "rules.isObligatory", false);
                const isDependent = get(setting, "rules.isDependent", false);

                if (isObligatory) {
                    if (!storedParams[setting.name]) {
                        dispatch(setVerifyStatus({ roomId: room?.id, status: false }));
                    }

                    const rules = get(setting, "rules.rules");
                    if (rules) {
                        rulesArray[setting.name] = rules;
                        dataArray[setting.name] = storedParams[setting.name];
                    }
                }

                const rules = get(setting, "rules.rules");
                if (rules) {
                    errorArray[setting.name] = rules;
                    dataErrorArray[setting.name] = storedParams[setting.name];
                }

                if (isDependent) {
                    dependantArray.push(setting.name);
                }
            });
        }
        Validator.setMessages("en", en);

        const validation = new Validator(dataArray, rulesArray, { required_if: "Campo requerido" });
        const veredict = validation.passes();

        const errVal = new Validator(dataErrorArray, errorArray, { required_if: "Campo requerido" });
        errVal.fails();
        // setErrorArray(errVal.errors.errors);

        const { errors } = errVal.errors;
        const dependantVeredict = !getDependantError(errors, dependantArray);

        dispatch(setVerifyStatus({ roomId: room?.id, status: veredict && dependantVeredict }));
        // setVerifyStatus(veredict && dependantVeredict);

        return false;
    };

    const getDependantError = (errorArray, dependantArray) => {
        if (!errorArray) {
            return false;
        }
        return dependantArray.some((dependant) => errorArray && errorArray.hasOwnProperty(dependant));
    };

    useEffect(() => {
        if (isEmpty(storedParams)) return;
        // getVerify(sidebarSettings);
        dispatch(setSidebarChanged({ roomId: room?.id, paramsChanged: storeParamsChanged() }));
    }, [storedParams]);

    const storeParamsChanged = () => isEqual(storedParamsData, storedParams);

    if (isRefetchingMessages) {
        return <RoomScreenSkeleton />;
    }

    return (
        <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
            <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <RoomHeader room={room} bot={bot} hasSidebarSettingsEnabled={hasSidebarSettingsEnabled} {...props} />
                <ImageBackground style={styles.backgroundImage}>
                    {/* bubbles */}
                    <BubbleContainer style={styles.bubbleContainer}>
                        <FlatList
                            keyExtractor={(_, index) => `message_${index}`} // fix error key
                            ref={scrollRef}
                            data={sortedMessages}
                            removeClippedSubviews={false}
                            initialNumToRender={20}
                            inverted
                            onScroll={handleScroll}
                            onEndReached={loadMoreMessages}
                            onEndReachedThreshold={0.6}
                            renderItem={(message) => {
                                const { item, index } = message;
                                const prevBubble = sortedMessages[index + 1];

                                return (
                                    <Bubble
                                        key={`message_${index}`}
                                        bubble={item}
                                        prevBubble={prevBubble}
                                        {...props}
                                        setForwardModalVisibility={setForwardModalVisibility}
                                    />
                                );
                            }}
                        />
                        {scrollButton ? (
                            <TouchableOpacity style={styles.scrollDown} onPress={scrollToBottom}>
                                <ScrollDownIcon />
                            </TouchableOpacity>
                        ) : null}
                    </BubbleContainer>
                </ImageBackground>
                <View style={{ flexDirection: "row" }}>
                    {fileList.map((file) => (
                        <UrlPreview title="" mediaUrl={file.mediaUrl} type={file.type} thumb_url="" />
                    ))}
                </View>
                <Pressable onPress={() => bottomSheetModalRef.current?.present()} style={styles.chatDetailsButton}>
                    <Text>Ver detalles de la conversación</Text>
                </Pressable>
                <SidebarModal
                    room={room}
                    sidebarSettings={sidebarSettings}
                    storedParams={storedParams}
                    setStoredParams={setStoredParams}
                    bottomSheetModalRef={bottomSheetModalRef}
                    storedParamsData={storedParamsData}
                />
                <ForwardModal
                    setForwardModalVisibility={setForwardModalVisibility}
                    forwardModalVisibility={forwardModalVisibility}
                    room={room}
                    navigation={navigation}
                />
                <InputRoom room={room} fileList={fileList} setFileList={setFileList} navigation={navigation} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: colors.white,
    },
    bubbleContainer: { backgroundColor: "transparent", position: "relative" },
    screen: {
        flex: 1,
    },
    downIconContainer: {
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        height: 40,
        width: 55,
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        bottom: 135,
        right: 0,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
        borderWidth: 1,
        borderColor: "#DCDEE4",
    },
    circleDownIcon: {
        borderWidth: 1,
        borderColor: colors.primary[500],
        borderRadius: 50,
    },
    downIcon: {
        color: colors.primary[500],
        width: 20,
        height: 20,
    },

    backgroundImage: {
        flex: 1,
        backgroundColor: "#white",
        shadowColor: "black",
    },
    scrollDown: {
        position: "absolute",
        backgroundColor: colors.white,
        right: 0,
        bottom: 24,
        paddingHorizontal: 16,
        padding: 8,
        borderWidth: 0.7,
        borderColor: colors.gray.outline,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        shadowColor: "#000000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: {
            height: 0,
            width: 0,
        },
    },
    button: {
        width: "100%",
        height: sizes.buttonLarge,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        backgroundColor: colors.neutral[100],
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        fontSize: sizes.fontLarge,
        fontWeight: "600",
        color: colors.secondary[100],
    },
    chatDetailsButton: {
        height: 40,
        position: "relative",
        backgroundColor: colors.gray[100],
        justifyContent: "center",
        alignItems: "center",
        borderTopRightRadius: 14,
        borderTopLeftRadius: 14,
        borderBottomColor: colors.gray.outline,
        borderBottomWidth: 0.5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: -1,
    },
});

export default RoomScreen;
