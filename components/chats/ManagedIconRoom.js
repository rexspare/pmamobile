import { View, StyleSheet, Image, Pressable } from "react-native";
import React from "react";
import colors from "../../constants/colors";
import { ORIGINS_ROOMS_ICONS } from "../../constants/constants";
import UnmanagedIcon from "../icons/UnmanagedIcon";
import ManagedIcon from "../icons/ManagedIcon";

const ManagedIconRoom = (props) => {
    const { conversation = {} } = props;
    const { wasReplied, origin } = conversation;
    const { source, image } = ORIGINS_ROOMS_ICONS[origin] ?? {};

    const { RepliedIcon, replieTippyLabel } = wasReplied
        ? {
              RepliedIcon: <ManagedIcon style={styles.managedIcon} />,
              replieTippyLabel: "Gestionado",
          }
        : {
              RepliedIcon: <UnmanagedIcon style={styles.managedIcon} />,
              replieTippyLabel: "No gestionado",
          };

    return (
        <View style={styles.moreInfo}>
            <View style={styles.button}>{image}</View>
            <View style={styles.button}>{RepliedIcon}</View>
        </View>
    );
};
const styles = StyleSheet.create({
    moreInfo: {
        flexDirection: "row",
        justifyContent: "flex-start",
    },
    moreInfoText: {
        fontSize: 12,
        fontWeight: "300",
        color: colors.gray[200],
        paddingBottom: 2,
    },
    managedIcon: {
        width: 14,
        height: 14,
    },
    button: {
        paddingRight: 5,
    },
});

export default ManagedIconRoom;
