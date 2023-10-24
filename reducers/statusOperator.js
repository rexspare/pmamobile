import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

const statusOperator = createSlice({
    name: "statusOperator",
    initialState,
    reducers: {
        setStatusOperator: (state, action) => {
            const statusOperator = action.payload;
            return statusOperator;
        },
    },
});

export const { setStatusOperator } = statusOperator.actions;

export default statusOperator.reducer;