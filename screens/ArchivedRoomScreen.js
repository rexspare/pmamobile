import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, ImageBackground, View, FlatList, Pressable, Text } from "react-native";
import colors from "../constants/colors";
import BubbleContainer from "../components/chats/bubbles/BubbleContainer";
import Bubble from "../components/chats/bubbles/Bubble";
import { first, get, isEmpty, last, sortBy } from "lodash";
import dayjs from "dayjs";
import ScrollDownIcon from "../components/icons/ScrollDownIcon";
import ArchivedRoomHeader from "../components/chats/ArchivedRoomHeader";
import { useDispatch, useSelector } from "react-redux";
import SidebarModal from "../components/sidebarModal";
import { useStoredParams } from "../api/query/useStoredParams";
import HeaderIcon from "../components/chats/HeaderIcon";
import HeaderTabHome from "../components/chats/HeaderTabHome";
import { getRoomMessages } from "../api/entities/rooms";
import { addArchivedMessages } from "../reducers/archivedMessages";

const ArchivedRoomScreen = (props) => {
    const { route, navigation } = props;
    const { params } = route;
    const { room, bot } = params || {};
    const roomId = room ? room.roomId : null;

    const [scrollButton, showScrollButton] = useState(false);
    const bottomSheetModalRef = useRef(null);

    const dispatch = useDispatch();

    const scrollRef = useRef(null);
    const teams = useSelector((state) => state.teams);
    const company = useSelector((state) => state.company);
    const userSession = useSelector((state) => state.userSession);
    const archivedMessages = useSelector((state) => state.archivedMessages);

    const { data: storedParams } = useStoredParams({ botId: bot?.id, userId: get(room, "user.id") });

    const conversationMessages = archivedMessages.filter((message) => {
        return message.roomId === roomId;
    });

    const sortedMessages = sortBy(conversationMessages, (data) => {
        return dayjs(data.createdAt);
    }).reverse();

    const scrollToEnd = () => {
        if (scrollRef.current) {
            scrollRef?.current?.scrollToEnd();
            showScrollButton(false);
        }
    };

    useEffect(() => {
        navigation.setOptions({
            // headerLeft: () => <HeaderTabHome navigation={navigation} />,
            headerRight: () => <HeaderIcon navigation={navigation} />,
        });
    }, [navigation]);

    // if (isLoading) {
    //     return <RoomScreenSkeleton />;
    // }

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

    const [canLoadMore, setCanLoadMore] = useState(true);

    const handleScroll = (event) => {
        const { contentOffset } = event.nativeEvent;
        const shouldLoadMore = contentOffset.y <= 200;

        if (shouldLoadMore && canLoadMore) {
            setCanLoadMore(false);
            loadMoreMessages();
        }
    };

    const loadMoreMessages = async () => {
        const getEarlyMessage = last(sortedMessages);
        if (isEmpty(room)) return;

        const options = { roomId: room?.roomId, limit: 10, _id: getEarlyMessage._id };
        const data = await getRoomMessages(options);
        if (isEmpty(data)) {
            setCanLoadMore(false);
            return;
        }
        dispatch(addArchivedMessages(data));
        setCanLoadMore(true);
    };

    return (
        <View style={styles.container}>
            <ArchivedRoomHeader room={room} {...props} />
            <ImageBackground style={styles.backgroundImage}>
                {/* bubbles */}
                <BubbleContainer style={styles.bubbleContainer}>
                    <FlatList
                        keyExtractor={(item) => item._id}
                        ref={scrollRef}
                        data={sortedMessages}
                        //getItemLayout={(data, index) => ({
                        //     length: 250,
                        //     offset: 250 * index,
                        //     index,
                        // })}
                        removeClippedSubviews={false}
                        initialNumToRender={20}
                        inverted={true}
                        onEndReached={({ distanceFromEnd }) => {
                            loadMoreMessages();
                        }}
                        onEndReachedThreshold={0.55}
                        renderItem={(message) => {
                            const { item, index } = message;
                            const prevBubble = sortedMessages[index + 1];
                            return <Bubble bubble={item} prevBubble={prevBubble} {...props} />;
                        }}
                    />
                    {scrollButton ? (
                        <Pressable style={styles.scrollDown} onPress={scrollToEnd}>
                            <ScrollDownIcon />
                        </Pressable>
                    ) : null}
                </BubbleContainer>
            </ImageBackground>
            <Pressable onPress={() => bottomSheetModalRef.current?.present()} style={styles.chatDetailsButton}>
                <Text>Ver detalles de la conversación</Text>
            </Pressable>
            <SidebarModal
                room={room}
                sidebarSettings={sidebarSettings}
                storedParams={storedParams}
                bottomSheetModalRef={bottomSheetModalRef}
                isArchived={true}
            />
        </View>
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
    chatDetailsButton: {
        height: 60,
        backgroundColor: colors.gray[100],
        justifyContent: "center",
        alignItems: "center",
        borderTopRightRadius: 16,
        borderTopLeftRadius: 16,
        borderBottomColor: colors.gray.outline,
        borderBottomWidth: 0.5,
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowRadius: 12,
        shadowOpacity: 0.2,
        shadowColor: "#000000",
    },
});

export default ArchivedRoomScreen;
