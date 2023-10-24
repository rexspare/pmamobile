import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getBots as getBotsfn } from "../api/entities/company";

const initialState = [];

export const getBots = createAsyncThunk("bots/getBots", async (args, thunkAPI) => {
    const { company } = thunkAPI.getState();

    const companyId = company?.id;

    const data = await getBotsfn({ companyId });
    return data;
});

export const bots = createSlice({
    name: "bots",
    initialState,

    extraReducers: (builder) => {
        builder.addCase(getBots.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});

export default bots.reducer;
