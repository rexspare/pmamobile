import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { get, isEmpty, castArray } from "lodash";
import colors from "../../../constants/colors";

import BubbleContainer from "./BubbleContainer";

const QuickReplyBubble = (props) => {
    const quickReplies = get(props, "message.QuickReplies", get(props, "message.quick_replies", []));
    //console.log("quickRepliesSss:", quickReplies);

    return (
        <BubbleContainer {...props} style={{ maxWidth: "80%", textAlign: "center" }}>
            {!isEmpty(quickReplies) &&
                castArray(quickReplies).map((option, index) => (
                    <View key={index} style={styles.nonSelectedButtonsContainer}>
                        <Text style={styles.nonSelectedButtonText}>{option.title}</Text>
                    </View>
                ))}
        </BubbleContainer>
    );
};

export default QuickReplyBubble;

const styles = StyleSheet.create({
    nonSelectedButtonsContainer: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: colors.primary[500],
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginTop: 7,
    },
    nonSelectedButtonText: { color: colors.primary[500] },
});
