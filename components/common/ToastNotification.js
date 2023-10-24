import React, { useState, useEffect } from "react";
import { View, Text, Modal, StyleSheet } from "react-native";
import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";
import AnimatedProgressBar from "react-native-simple-animated-progress-bar";
import colors from "../../constants/colors";
import SuccessIcon from "../icons/SuccessIcon";
import CloseIcon from "../icons/CloseIcon";

const ToastNotification = ({ nameRoom, itemName }) => {
    const [modalVisible, setModalVisible] = useState(true);
    const [currentProgress, setCurrentProgress] = useState(0);

    const updateProgress = () => {
        if (currentProgress < 100) {
            setCurrentProgress(currentProgress + 1);
        } else {
            setModalVisible(false);
        }
    };

    useEffect(() => {
        if (modalVisible) {
            const progressTimer = setInterval(updateProgress, 10);
            return () => clearInterval(progressTimer);
        }
    }, [modalVisible]);

    return (
        <Modal animationType="fade" transparent visible={modalVisible}>
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
                            Has transferido el caso de <Text style={{ fontWeight: "bold" }}>{nameRoom}</Text> al operador{" "}
                            <Text style={{ fontWeight: "bold" }}>{itemName}</Text> exitosamente.
                        </Text>
                        <CloseIcon onPress={() => setModalVisible(!modalVisible)} underlayColor={colors.secondary[100]} />
                    </View>
                    <View style={styles.progressBarContainer}>
                        {/* <AnimatedProgressBar
                            size={5}
                            duration={4000}
                            progress={currentProgress}
                            barColor={"#2BD88F"}
                            rootStyle={{
                                marginTop: 15,
                                width: 350,
                            }}
                        /> */}
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

export default ToastNotification;
