import React, { memo } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { isEmpty, toLower } from "lodash";
import { SIDEBAR_SETTINGS } from "../../constants/constants";
import colors from "../../constants/colors";
import sizes from "../../constants/sizes";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useSelector } from "react-redux";

// Load the necessary plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const SidebarElement = (props) => {
    const {
        name,
        type,
        options,
        rules: { rules },
    } = props.element;
    const userSession = useSelector((state) => state.userSession);
    const { timezone = "America/Guayaquil" } = userSession;
    const { value, onChange } = props;

    const getKeyboardType = (type, rules) => {
        if (type === SIDEBAR_SETTINGS.TEXT) {
            if (rules.includes("email")) {
                return "email-address";
            }
            if (rules.includes("numeric")) {
                return "numeric";
            }
            return "default";
        }
    };

    switch (toLower(type)) {
        case SIDEBAR_SETTINGS.DATE:
            // Get value as a Date Object
            const newValue = isEmpty(value) ? new Date() : new Date(dayjs(value).tz(timezone));
            return (
                <RNDateTimePicker
                    value={newValue}
                    onChange={(event) => {
                        const {
                            nativeEvent: { timestamp },
                        } = event;
                        const date = dayjs(timestamp).format("YYYY-MM-DD");
                        onChange(name, date);
                    }}
                    locale="es-ES"
                />
            );

        case SIDEBAR_SETTINGS.SELECT:
            return (
                <View style={styles.selectContainer}>
                    <RNPickerSelect
                        placeholder={{ label: "Seleccione opcion", value: "" }}
                        onValueChange={(value) => onChange(name, value)}
                        value={value || ""}
                        items={options}
                        style={{
                            inputIOS: styles.selectIOS,
                            inputAndroid: styles.selectAndroid,
                        }}
                    />
                </View>
            );

        case SIDEBAR_SETTINGS.TEXTBOX:
            return (
                <TextInput
                    onChangeText={(value) => onChange(name, value)}
                    value={value}
                    style={[styles.inputContainer, { height: "auto" }]}
                    multiline={true}
                    inputMode={"text"}
                />
            );

        case SIDEBAR_SETTINGS.TEXT:
            return (
                <TextInput
                    onChangeText={(value) => onChange(name, value)}
                    value={value}
                    style={[styles.inputContainer, { height: "auto" }]}
                    keyboardType={getKeyboardType(type, rules)}
                    inputMode={"text"}
                />
            );
        default:
            return (
                <TextInput
                    onChangeText={(value) => onChange(name, value)}
                    value={value}
                    style={[styles.inputContainer]}
                    keyboardType={getKeyboardType(type, rules)}
                    inputMode={"text"}
                />
            );
    }
};

const styles = StyleSheet.create({
    inputContainer: {
        color: colors.secondary[100],
        fontWeight: "500",
        borderRadius: 9,
        borderWidth: 1,
        borderColor: colors.gray.outline,
        minHeight: sizes.inputHeight,
        paddingHorizontal: sizes.inputHorizontalPadding,
        textAlignVertical: "top",
        paddingTop: 0,
        paddingBottom: 0,
    },
    selectContainer: {
        borderColor: colors.gray.outline,
        borderRadius: 9,
        borderWidth: 1,
        height: sizes.inputHeight,
        justifyContent: "center",
    },
    selectIOS: {
        color: colors.secondary[100],
        fontWeight: "500",
        paddingHorizontal: sizes.inputHorizontalPadding,
    },
    selectAndroid: {
        color: colors.secondary[100],
        fontWeight: "500",
    },
    datePicker: {
        dateIcon: {
            position: "absolute",
            left: 0,
            top: 4,
            marginLeft: 0,
        },
        dateInput: {
            marginLeft: 36,
        },
    },
});

export default memo(SidebarElement);
