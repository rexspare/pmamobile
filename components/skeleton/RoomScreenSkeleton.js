import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import colors from "../../constants/colors";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const RoomsSkeleton = () => {
    const data = new Array(6);

    return (
        <View
            style={{
                backgroundColor: colors.white,
                flexDirection: "column",
                flex: 1,
            }}>
            <View
                style={{
                    flexDirection: "row",
                    backgroundColor: colors.white,
                    padding: 25,
                    borderBottomColor: colors.gray.outline,
                    borderBottomWidth: 1,
                    marginBottom: 10,
                }}>
                <ShimmerPlaceholder style={styles.profile}></ShimmerPlaceholder>
                <View
                    style={{
                        flexDirection: "column",
                        height: 50,
                        flexGrow: 1,
                    }}>
                    <ShimmerPlaceholder style={styles.bar}></ShimmerPlaceholder>
                    <ShimmerPlaceholder style={styles.bar}></ShimmerPlaceholder>
                </View>
            </View>
            <View>
                <FlatList
                    data={data}
                    renderItem={() => (
                        <View style={styles.container}>
                            <ShimmerPlaceholder style={styles.leftBubble}></ShimmerPlaceholder>
                            <ShimmerPlaceholder style={styles.rightBubble}></ShimmerPlaceholder>
                        </View>
                    )}
                />
            </View>
        </View>
    );
};

export default RoomsSkeleton;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingBottom: 5,
        flex: 1,
        backgroundColor: colors.white,
        flexDirection: "column",
    },
    containerSkeleton: {
        padding: 20,
        flex: 1,
        backgroundColor: colors.white,
        flexDirection: "row",
        height: 80,
    },
    profile: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
        flexDirection: "column",
        height: 50,
    },
    bar: {
        flex: 1,
        width: "100%",
        marginBottom: 8,
    },
    leftBubble: {
        flex: 1,
        height: 45,
        borderRadius: 12,
        paddingVertical: 5,
    },
    rightBubble: { flex: 1, height: 45, borderRadius: 12, paddingVertical: 5, alignSelf: "flex-end" },
});
