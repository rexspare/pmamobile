import React from "react";
import { StyleSheet, View } from "react-native";
import { useSelector } from "react-redux";
import CrmTags from "./crmTags";
import SidebarForm from "./SidebarForm";
import SidebarFormView from "./SidebarFormView";
import colors from "../../constants/colors";

const SidebarCRM = (props) => {
    const { sidebarSettings, storedParams, setStoredParams, roomInfo, isArchived } = props;
    const hasSidebarSettings = sidebarSettings.length > 0;
    const sidebarChangedSelector = useSelector((state) => state.sidebarChanged);
    const verifyStatusSelector = useSelector((state) => state.verifyStatus);

    const sidebarChanged = sidebarChangedSelector.find((status) => status.roomId === roomInfo?.id);
    const verifyStatus = verifyStatusSelector.find((status) => status.roomId === roomInfo?.id);

    return (
        <View style={styles.container}>
            <CrmTags isArchived={isArchived} roomInfo={roomInfo} {...props} />
            {hasSidebarSettings ? (
                isArchived ? (
                    <SidebarFormView sidebarSettings={sidebarSettings} storedParams={storedParams} roomInfo={roomInfo} />
                ) : (
                    <SidebarForm
                        sidebarSettings={sidebarSettings}
                        storedParams={storedParams}
                        roomInfo={roomInfo}
                        verifyStatus={verifyStatus}
                        sidebarChanged={sidebarChanged}
                        setStoredParams={setStoredParams}
                    />
                )
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
});

export default SidebarCRM;
