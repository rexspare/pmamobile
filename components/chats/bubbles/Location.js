import { Image, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import colors from "../../../constants/colors";

const LOCATION_KEY = process.env.REACT_APP_LOCATION_KEY || "AIzaSyA_XEcbF3DxyQ6LXRLUdNBz4BMomE35Pvs";

const LocationBubble = (props) => {
    const { message, footerBubble, headerBubble } = props;
    const { lat, lng } = message;

    const openMaps = (latitude, longitude) => {
        const url = Platform.select({
            ios: `comgooglemaps://?center=${latitude},${longitude}&zoom=14&views=traffic"`,
            android: `geo://?q=${latitude},${longitude}`,
        });

        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    return Linking.openURL(url);
                } else {
                    const browser_url = `https://www.google.de/maps/@${latitude},${longitude}`;
                    return Linking.openURL(browser_url);
                }
            })
            .catch(() => {
                if (Platform.OS === "ios") {
                    Linking.openURL(`maps://?q=${latitude},${longitude}`);
                }
            });
    };

    return (
        <View style={styles.locationContainer}>
            {headerBubble()}
            <Pressable style={styles.locationButton} onPress={() => openMaps(lat, lng)}>
                <Image
                    style={{
                        ...styles.location,
                    }}
                    source={{
                        uri: `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=270x200&markers=${lat},${lng}&key=${LOCATION_KEY}`,
                    }}
                />
                {footerBubble()}
            </Pressable>
        </View>
    );
};

export default LocationBubble;

const styles = StyleSheet.create({
    locationContainer: {
        width: "50%",
        flexDirection: "column",
    },
    locationButton: { position: "relative" },
    location: { width: "100%", height: 120, borderRadius: 8, margin: 3, resizeMode: "cover", alignSelf: "center" },
    time: {
        position: "absolute",
        fontSize: 11,
        textAlign: "right",
        color: colors.default,
        fontFamily: "regular",
        marginBottom: 5,
        marginRight: 5,
        bottom: 0,
        right: 0,
        shadowColor: "#000000",
        shadowOpacity: 1,
        shadowRadius: 6,
        shadowOffset: {
            height: 1,
            width: 1,
        },
    },
});
