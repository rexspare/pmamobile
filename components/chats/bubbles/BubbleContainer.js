import { StyleSheet, View } from "react-native";

const BubbleContainer = (props) => {
    return <View style={{ ...styles.container, ...props.style }}>{props.children}</View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
});

export default BubbleContainer;
