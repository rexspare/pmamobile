import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import DashboardServer from "../api/DashboardServer";
import get from "lodash/get";

const initialState = [];

const teams = createSlice({
    name: "teams",
    initialState,
    reducers: {
        addTeams: (state, action) => {
            const teams = action.payload;
            return teams;
        },
        unsetTeams: (state, action) => {
            return [];
        },
    },
});

export const { addTeams, unsetTeams } = teams.actions;

export default teams.reducer;
