import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

const sidebarChannel = createSlice({
    name: "sidebarChannel",
    initialState,
    reducers: {
        setSidebarChannel: (state, action) => {
            const channel = action.payload;
            return channel;
        },
    },
});

export const { setSidebarChannel } = sidebarChannel.actions;

export default sidebarChannel.reducer;