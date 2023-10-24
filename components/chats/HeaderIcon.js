import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import ProfileAvatar from "../common/ProfileAvatar";
import { operatorStatusColor } from "../../utils/helpers";

const HeaderIcon = ({ navigation }) => {
    const userSession = useSelector((state) => state.userSession);
    const { names = "", operatorActive } = userSession;

    const color = operatorStatusColor(operatorActive);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={styles.headerButton}>
                <ProfileAvatar
                    names={names}
                    backgroundColor="#d2b1fc"
                    size={38}
                    textColor="#fff"
                    borderColor={color}
                    backgroundColorBullet={color}
                    fontSize={16}
                    sizeConnectionBullet={8}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flexDirection: "row", alignItems: "center" },
    headerButton: { marginLeft: 15 },
    imageIcon: { width: 24, height: 24 },
});

export default HeaderIcon;
