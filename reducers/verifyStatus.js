import { createSlice } from "@reduxjs/toolkit";
import { mergeById } from "../utils/helpers";

const initialState = [];

export const verifyStatus = createSlice({
    name: "verifyStatus",
    initialState,
    reducers: {
        setVerifyStatus: (state, action) => {
            const verifyStatus = action.payload;
            return mergeById(state, verifyStatus, "roomId");
        },
        deleteVerifyStatus: (state, action) => {
            const verifyStatus = state.filter((verifyStatus) => verifyStatus.roomId !== action.payload);
            console.log("deleteVerifyStatus", verifyStatus);
            return verifyStatus;
        },
    },
});

export const { setVerifyStatus, deleteVerifyStatus } = verifyStatus.actions;

export default verifyStatus.reducer;
