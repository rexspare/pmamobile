import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import ContactCard from "../components/chats/ContactCard";
import { first } from "lodash";
import colors from "../constants/colors";

const ContactScreen = (props) => {
    console.log("ContactScreen props", props);
    const {
        route: {
            params: { contacts },
        },
    } = props;

    const contact = first(contacts);

    const showOneOrMoreContacts = () => {
        if (contacts.length > 1) {
            return <FlatList data={contacts} renderItem={({ item }) => <ContactCard contact={item} />} />;
        }
        return <ContactCard contact={contact} />;
    };

    return <View style={{ backgroundColor: colors.white, flex: 1 }}>{showOneOrMoreContacts()}</View>;
};

export default ContactScreen;

const styles = StyleSheet.create({});
