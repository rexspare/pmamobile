import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const permissions = createSlice({
    name: "permissions",
    initialState,
    reducers: {
        setPermissions: (state, action) => {
            const permissions = action.payload;
            return permissions;
        },
    },
});

export const { setPermissions } = permissions.actions;

export default permissions.reducer;



