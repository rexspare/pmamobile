import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { get } from "lodash";
import colors from "../../../constants/colors";
import { Menu, MenuOptions, MenuOption, MenuTrigger, renderers } from "react-native-popup-menu";

const { ContextMenu } = renderers;

const TextBubble = (props) => {
    const { nameRoom, message, parentBubbleStyle, textStyle, footerBubble, headerBubble, selectForward, copyToClipboard } = props;
    const text = get(message, "text", "");


    return (
        <View style={parentBubbleStyle}>
            <Menu renderer={ContextMenu}>
                <MenuTrigger customStyles={triggerStyles}>
                    <View style={styles.textContainer}>
                        {headerBubble()}
                        <Text style={textStyle}>{text}</Text>
                        {footerBubble()}
                    </View>
                </MenuTrigger>
                <MenuOptions customStyles={optionsStyles}>
                    <MenuOption
                        onSelect={() => {
                            copyToClipboard(message.text);
                        }}
                        text="Copiar"
                    />
                    <MenuOption onSelect={() => selectForward(message)} text="Reenviar" />
                </MenuOptions>
            </Menu>
        </View>
    );
};

export default TextBubble;

const styles = StyleSheet.create({
    textContainer: { flexDirection: "column" },
});

const triggerStyles = {
    triggerText: {
        color: "white",
    },
    triggerTouchable: {
        underlayColor: colors.primary[50],
        activeOpacity: 70,
        style: {
            flex: 1,
        },
    },
};

const optionsStyles = {
    optionsContainer: {
        backgroundColor: colors.primary[100],
        padding: 5,
        borderRadius: 5,
    },
    optionWrapper: {
        margin: 5,
    },
    optionText: {
        color: colors.primary[500],
    },
};
