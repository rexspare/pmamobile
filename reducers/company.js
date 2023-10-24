import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import get from "lodash/get";
import JelouApiV1 from "../api/JelouApiV1";

const initialState = {};
export const getCompany = createAsyncThunk("company/getCompany", async (headers = false) => {
    try {
        const { data } = await JelouApiV1.get("/company", headers);

        return data;
    } catch (error) {
        console.log("error retrieving company", error);
    }
});

export const company = createSlice({
    name: "company",
    initialState,
    reducers: {
        setCompany: (state, action) => {
            const payload = action.payload;
            return payload;
        },
        unsetCompany: () => {
            return {};
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getCompany.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});

export const { setCompany, unsetCompany } = company.actions;

export default company.reducer;
