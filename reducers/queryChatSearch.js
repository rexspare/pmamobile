
import { createSlice } from "@reduxjs/toolkit";

const initialState = "";

export const queryChatSearch = createSlice({
    name: "queryChatSearch",
    initialState,
    reducers: {
        setQueryChatSearch: (state, action) => {
            return action.payload;
        },
    },
});

export const { setQueryChatSearch } = queryChatSearch.actions;

export default queryChatSearch.reducer;
