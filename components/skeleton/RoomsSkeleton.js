import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import colors from "../../constants/colors";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const RoomsSkeleton = () => {
    const data = new Array(6);

    return (
        <>
            <FlatList
                data={data}
                renderItem={() => (
                    <View style={styles.container}>
                        <ShimmerPlaceholder style={styles.profile}></ShimmerPlaceholder>
                        <View style={styles.infoContainer}>
                            <ShimmerPlaceholder style={styles.info}></ShimmerPlaceholder>
                            <ShimmerPlaceholder style={styles.info}></ShimmerPlaceholder>
                            <ShimmerPlaceholder style={styles.info}></ShimmerPlaceholder>
                        </View>
                    </View>
                )}
            />
        </>
    );
};

export default RoomsSkeleton;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        backgroundColor: colors.white,
        flexDirection: "row",
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
        marginHorizontal: 10,
    },
    infoContainer: {
        flex: 1,
        flexDirection: "column",
        height: 50,
    },
    info: {
        flex: 1,
        width: "100%",
        marginBottom: 5,
    },
});
