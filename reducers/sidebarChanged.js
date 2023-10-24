import { createSlice } from "@reduxjs/toolkit";
import { mergeById } from "../utils/helpers";

const initialState = [];

export const sidebarChanged = createSlice({
    name: "sidebarChanged",
    initialState,
    reducers: {
        setSidebarChanged: (state, action) => {
            const sidebarChanged = action.payload;
            return mergeById(state, sidebarChanged, "roomId");
        },
        deleteSidebarChanged: (state, action) => {
            const verifyStatus = state.filter((verifyStatus) => verifyStatus.roomId !== action.payload);
            return verifyStatus;
        },
    },
});

export const { setSidebarChanged, deleteSidebarChanged } = sidebarChanged.actions;

export default sidebarChanged.reducer;
