import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import UserAvatar from "react-native-user-avatar";
import { DEFAULT_AVATAR } from "../../constants/constants";
import colors from "../../constants/colors";
import { capitalize, isEmpty, toUpper } from "lodash";

const ContactCard = (props) => {
    const { contact } = props;
    const { addresses, emails, name, phones } = contact;

    const renderList = (item, typeList, isLast = false) => {
        switch (toUpper(typeList)) {
            case "PHONE": {
                const { type, phone } = item;
                const typeTitle = toUpper(type) === "CELL" ? "Celular" : capitalize(type);
                return (
                    <View
                        style={{
                            ...styles.bubbleList,
                            borderBottomColor: colors.gray.outline,
                            ...(isLast ? { borderBottomWidth: 0 } : { borderBottomWidth: 0.5 }),
                        }}>
                        <Text style={{ fontSize: 12, paddingVertical: 4, color: colors.default, fontWeight: "500" }}>{typeTitle}</Text>
                        <Text style={{ color: colors.primary[500], paddingLeft: 6 }}>{phone}</Text>
                    </View>
                );
            }
            case "ADDRESS": {
                const { type, city = "", country = "", street = "" } = item;
                return (
                    <View style={styles.bubbleList}>
                        <Text style={{ fontSize: 12, paddingVertical: 4, color: colors.default, fontWeight: "500" }}>{type}</Text>
                        <Text style={{ color: colors.primary[500], paddingLeft: 6 }}>{street}</Text>
                        <Text style={{ color: colors.primary[500], paddingLeft: 6 }}>{city}</Text>
                        <Text style={{ color: colors.primary[500], paddingLeft: 6 }}>{country}</Text>
                    </View>
                );
            }
            case "EMAIL": {
                const { type, email } = item;
                const typeTitle = toUpper(type) === "INTERNET" ? "Mail" : capitalize(type);
                return (
                    <View
                        style={{
                            ...styles.bubbleList,
                            borderBottomColor: colors.gray.outline,
                            ...(isLast ? { borderBottomWidth: 0 } : { borderBottomWidth: 0.5 }),
                        }}>
                        <Text style={{ fontSize: 12, paddingVertical: 4, color: colors.default, fontWeight: "500" }}>{typeTitle}</Text>
                        <Text style={{ color: colors.primary[500], paddingLeft: 6 }}>{email}</Text>
                    </View>
                );
            }
            default:
                break;
        }
    };

    const showList = (list, typeList) => {
        const totalList = list.length;
        return (
            <FlatList
                data={list}
                renderItem={(items) => {
                    const { item } = items;
                    const isLast = totalList - 1 === items.index;
                    return renderList(item, typeList, isLast);
                }}
            />
        );
    };

    return (
        <SafeAreaView style={styles.contactAreaView}>
            <UserAvatar style={styles.contactContainer} name={name} size={100} src={DEFAULT_AVATAR} />
            <Text style={styles.nameContact}>{name}</Text>
            <View style={styles.showListContainer}>{showList(phones, "PHONE")}</View>
            {!isEmpty(addresses) ? <View style={styles.showListContainer}>{showList(addresses, "ADDRESS")}</View> : null}
            {!isEmpty(emails) ? <View style={styles.showListContainer}>{showList(emails, "EMAIL")}</View> : null}
        </SafeAreaView>
    );
};

export default ContactCard;

const styles = StyleSheet.create({
    contactAreaView: { flexDirection: "column", flex: 1 },
    contactContainer: { flexDirection: "row", marginVertical: 10, width: 100, height: 100, alignSelf: "center" },
    nameContact: { color: colors.default, fontSize: 20, fontWeight: "600", textAlign: "center" },
    showListContainer: { backgroundColor: colors.gray[100], borderRadius: 10, margin: 20, paddingVertical: 10 },
    bubbleList: { paddingHorizontal: 10, color: colors.default, paddingBottom: 4 },
});
