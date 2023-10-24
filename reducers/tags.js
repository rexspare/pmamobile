import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

export const tags = createSlice({
    name: "tags",
    initialState: [],
    reducers: {
        setTags: (state, action) => {
            const tags = action.payload;
            return tags;
        },
    },
});

export const { setTags } = tags.actions;

export default tags.reducer;
