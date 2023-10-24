import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Audio } from "expo-av";
import PlayIcon from "../../icons/PlayIcon";
import PauseIcon from "../../icons/PauseIcon";
import colors from "../../../constants/colors";
import Slider from "@react-native-community/slider";
import { formatTime } from "../../../utils/helpers";

const { width } = Dimensions.get("window");

const AudioBubble = (props) => {
    const { message, parentBubbleStyle, footerBubble, headerBubble } = props;
    const { mediaUrl } = message;

    const [isPlaying, setIsPlaying] = useState(false);
    const [sound, setSound] = useState(null);
    const [position, setPosition] = useState(0);
    const [duration, setDuration] = useState(0);
    const [pausedPosition, setPausedPosition] = useState(0);
    const [isDurationLoaded, setIsDurationLoaded] = useState(null);

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    useEffect(() => {
        preloadAudio();
    }, []);

    async function playSound() {
        try {
            if (sound && pausedPosition > 0) {
                await sound.setPositionAsync(pausedPosition);
                await sound.playAsync();
            } else {
                const sound = new Audio.Sound();
                await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
                await sound.loadAsync({ uri: mediaUrl }, { shouldPlay: true });
                sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
                setSound(sound);
            }
            setIsPlaying(true);
        } catch (error) {
            console.log("Error playing sound:", error);
        }
    }

    async function preloadAudio() {
        try {
            const { sound } = await Audio.Sound.createAsync({ uri: mediaUrl }, { shouldPlay: false });
            const status = await sound.getStatusAsync();
            setDuration(status.durationMillis);
            setIsDurationLoaded(true);
            setSound(sound);
        } catch (error) {
            console.log("Error preloading audio:", error);
        }
    }

    function onPlaybackStatusUpdate(status) {
        if (status.isLoaded) {
            setPosition(status.positionMillis);
            setDuration(status.durationMillis);
            if (status.didJustFinish) {
                return resetPlayer();
            }
        }
    }

    async function pauseSound() {
        try {
            if (sound) {
                const status = await sound.pauseAsync();
                if (status) {
                    setPausedPosition(position);
                    setIsPlaying(false);
                }
            }
        } catch (error) {
            console.log("Error pausing sound:", error);
        }
    }

    async function resetPlayer() {
        try {
            if (sound) {
                setIsPlaying(false);
                setPausedPosition(0);
                setPosition(0);
                // await sound.pauseAsync();
                // await sound.setStatusAsync({ shouldPlay: false, positionMillis: 0 });
                // await sound.setPositionAsync(0);
            }
        } catch (error) {
            console.log("Error resetting sound:", error);
        }
    }

    async function seekSound(position) {
        try {
            await sound.setPositionAsync(position);
            setPausedPosition(position);
            setPosition(position);
        } catch (error) {
            console.log("Error seeking sound:", error);
        }
    }

    return (
        <View style={{ ...parentBubbleStyle }}>
            {headerBubble()}
            <View style={styles.audioContainer}>
                {isPlaying ? (
                    <TouchableOpacity style={styles.audioButtons} onPress={pauseSound}>
                        <PauseIcon />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.audioButtons} onPress={playSound}>
                        <PlayIcon />
                    </TouchableOpacity>
                )}
                <View style={styles.containerSlider}>
                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={duration}
                        value={position}
                        onValueChange={seekSound}
                        minimumTrackTintColor={colors.primary[500]}
                        maximumTrackTintColor={colors.gray[200]}
                        thumbStyle={{ width: 8, height: 8 }}
                        thumbTouchSize={{ width: 40, height: 40 }}
                    />
                    {isPlaying ? (
                        <Text style={styles.audioTime}>{`${formatTime(position)}`}</Text>
                    ) : (
                        <Text style={styles.audioTime}>{isDurationLoaded ? `${formatTime(duration)}` : "0:00"}</Text>
                    )}
                </View>
            </View>
            {footerBubble()}
        </View>
    );
};

export default AudioBubble;

const styles = StyleSheet.create({
    audioContainer: { flex: 1, flexDirection: "row", alignItems: "center" },
    audioTime: { color: colors.default, fontSize: 12, textAlign: "right", marginHorizontal: 10 },
    containerSlider: { flexDirection: "column" },
    slider: { width: width / 2, height: 30, alignItems: "center", marginTop: 8 },
    audioButtons: { marginHorizontal: 6 },
});
