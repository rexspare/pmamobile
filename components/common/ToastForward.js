import React, { useState, useEffect } from "react";
import { View, Text, Modal, StyleSheet } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated"; 
import colors from "../../constants/colors";
import SuccessIcon from "../icons/SuccessIcon";
import CloseIcon from "../icons/CloseIcon";

const ToastForward = ({ selectedRoom }) => {
    const [isVisible, setIsVisible] = useState(true);
   
    
    const setModalVisible = (visible) => {
        setIsVisible(visible);
      };

    return (
        <Modal animationType="fade" transparent visible={isVisible}>
            <View style={styles.overlay}>
            <Animated.View entering={FadeInUp} exiting={FadeOutUp} style={styles.toastContainer}> 
                    <View style={{ flexDirection: "row", fontWeight: 400 }}>
                        <SuccessIcon />
                        <Text
                            style={{
                                color: colors.secondary,
                                marginLeft: 10,
                                fontSize: 14,
                                flexWrap: "wrap",
                                width: "82%",
                                fontFamily: "regular",
                            }}>
                            Has reenviado un mensaje a <Text style={{ fontWeight: "bold" }}>{selectedRoom?.name}</Text> exitosamente.
                        </Text>
                        <CloseIcon onPress={() => setModalVisible(!modalVisible)} underlayColor={colors.secondary[100]} />
                    </View>
                    <View style={styles.progressBarContainer}> 
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    toastContainer: {
        bottom: 300,
        backgroundColor: "white",
        width: "90%",
        borderRadius: 12,
        padding: 20,
        justifyContent: "flex-start",
        shadowColor: "black",
        shadowOpacity: 0.4,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
    },
    progressBarContainer: {
        flex: 1,
        flexDirection: "row",
        marginTop: 10,
        width: "100%",
        height: 15,
    },
});

export default ToastForward;
