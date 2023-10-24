import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { forwardRef, useCallback, useEffect, useImperativeHandle } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { Extrapolate, interpolate, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT + 50;

const BottomSheet = forwardRef((props, ref) => {
    const translateY = useSharedValue(0);
    const context = useSharedValue({ y: 0 });
    const active = useSharedValue(false);

    const scrollTo = useCallback((destination) => {
        "worklet";
        active.value = destination !== 0;
        translateY.value = withSpring(destination, { damping: 30 });
    }, []);

    const isActive = useCallback(() => {
        return active.value;
    }, []);

    useImperativeHandle(ref, () => ({ scrollTo, isActive }), [scrollTo]);

    const gesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translateY.value };
        })
        .onUpdate((event) => {
            translateY.value = event.translationY + context.value.y;
            translateY.value = Math.max(translateY.value, MAX_TRANSLATE_Y);
        })
        .onEnd(() => {
            if (translateY.value > -SCREEN_HEIGHT / 3) {
                scrollTo(0);
            } else if (translateY.value > -SCREEN_HEIGHT / 1.5) {
                scrollTo(MAX_TRANSLATE_Y);
            }
        });

    const rBottomSheetStyle = useAnimatedStyle(() => {
        const borderRadius = interpolate(translateY.value, [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y], [25, 5], Extrapolate.CLAMP);
        return { borderRadius, transform: [{ translateY: translateY.value }] };
    });

    const rBackdropStyle = useAnimatedStyle(() => {
        return { opacity: withTiming(active.value ? 1 : 0) };
    }, []);

    const rBackdropProps = useAnimatedStyle(() => {
        return { pointerEvents: active.value ? "auto" : "none" };
    });

    return (
        <>
            <Animated.View
                pointerEvents="none"
                onTouchStart={() => {
                    scrollTo(0);
                }}
                animatedProps={rBackdropProps}
                style={[{ ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.4)" }, rBackdropStyle]}
            />
            <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.bottomSheetContainer, rBottomSheetStyle]}>
                    <View style={styles.line} />
                    {props.children}
                </Animated.View>
            </GestureDetector>
        </>
    );
});

export default BottomSheet;

const styles = StyleSheet.create({
    bottomSheetContainer: {
        height: SCREEN_HEIGHT,
        width: "100%",
        backgroundColor: "white",
        position: "absolute",
        top: SCREEN_HEIGHT,
        borderRadius: 25,
    },
    line: {
        width: 75,
        height: 4,
        backgroundColor: "grey",
        alignSelf: "center",
        marginVertical: 15,
        borderRadius: 2,
    },
});
