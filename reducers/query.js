
import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

export const querySearch = createSlice({
    name: "querySearch",
    initialState,
    reducers: {
        setQuerySearch: (state, action) => {
        return {query: action.payload};
        },
    },
});

export const { setQuerySearch } = querySearch.actions;

export default querySearch.reducer;
