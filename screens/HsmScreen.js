import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import colors from "../constants/colors";
import HeaderTabHome from "../components/chats/HeaderTabHome";
import HeaderIcon from "../components/chats/HeaderIcon";

const HsmScreen = (props) => {
    const { navigation } = props;
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => <HeaderTabHome navigation={navigation} />,
            headerRight: () => <HeaderIcon navigation={navigation} />,
        });
    }, [navigation]);

    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <Text>HsmScreen</Text>
        </View>
    );
};

export default HsmScreen;

const styles = StyleSheet.create({});
