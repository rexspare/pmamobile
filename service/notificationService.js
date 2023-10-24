import { Platform } from "react-native";
import * as Notifications from "expo-notifications";

// Function to register for push notifications
export const registerForPushNotificationsAsync = async () => {
    let token;

    if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
            name: "Default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
        });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    console.log("status notifications", existingStatus);

    if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notifications!");
        return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;

    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
            sound: require("../assets/newMsg.mp3"),
            icon: require("../assets/Adaptative.png"),
        }),
    });

    Notifications.addNotificationReceivedListener(handleNotification);

    // Register the background task to receive notifications in the background
    if (Platform.OS === "android" && Constants.isDevice) {
        Notifications.registerTaskAsync(Notifications.AndroidNotificationPriority.DEFAULT, {
            taskName: "backgroundTask",
            taskTitle: "Background Task",
            taskIcon: "path/to/custom/icon.png", // Replace with the path to your custom icon image
            taskDesc: "This task is used for receiving notifications in the background.",
            taskColor: "#FF231F7C",
        });
    }

    // Configure actions on the notification badge
    Notifications.setNotificationCategoryAsync("badge", [
        {
            identifier: "action1",
            buttonTitle: "Action 1",
            options: {
                foreground: true,
                authenticationRequired: true,
            },
        },
        {
            identifier: "action2",
            buttonTitle: "Action 2",
            options: {
                foreground: true,
                authenticationRequired: true,
            },
        },
    ]);

    console.log("Push token:", token);

    return token;
    // TODO: Send the push token to your server for further processing
};

// Function to handle incoming notifications
export const handleNotification = (notification) => {
    // Handle the received notification here
    console.log("Received notification:", notification);
};
