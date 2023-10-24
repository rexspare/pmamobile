import React from "react";
import { StyleSheet, View, TouchableWithoutFeedback, Text, Image, FlatList } from "react-native";
import { Entypo } from "@expo/vector-icons";
import ProfileListItem from "./profileListItem";
import colors from "../../constants/colors";
import sizes from "../../constants/sizes";
import UserGroupIcon from "../icons/UserGroupIcon";
import SmsIcon from "../icons/SmsIcon";

const ProfileList = (props) => {
    const { onPressFunction, icon, title, renderVariable = false, dataToRender } = props;

    return (
        <View style={styles.rowContainer}>
            <TouchableWithoutFeedback onPress={onPressFunction}>
                <View style={styles.headerContainer}>
                    <View style={styles.titleContainer}>
                        {icon === "client" ? <UserGroupIcon /> : <SmsIcon style={{ width: 25, height: 24 }} />}
                        <Text style={styles.title}>{title}</Text>
                    </View>
                    {renderVariable ? (
                        <Entypo name="chevron-small-up" size={24} color={colors.secondary[100]} />
                    ) : (
                        <Entypo name="chevron-small-down" size={24} color={colors.secondary[100]} />
                    )}
                </View>
            </TouchableWithoutFeedback>
            {renderVariable && <FlatList data={dataToRender} renderItem={ProfileListItem} keyExtractor={(item) => item.id} />}
        </View>
    );
};

const styles = StyleSheet.create({
    rowContainer: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray.outline,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    titleContainer: {
        flexDirection: "row",
        gap: 7,
        alignItems: "center",
    },
    icon: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },
    title: {
        fontSize: sizes.fontLarge,
        fontWeight: "700",
        color: colors.secondary[100],
    },
});

export default ProfileList;
