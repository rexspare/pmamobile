import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLogged: false,
    didTryAutoLogin: false,
};

const login = createSlice({
    name: "login",
    initialState,
    reducers: {
        setIsLogged: (state, action) => {
            state.isLogged = action.payload;
        },
        setDidTryAutoLogin: (state, action) => {
            state.didTryAutoLogin = true;
        },
    },
});

export const { setIsLogged, setDidTryAutoLogin } = login.actions;

export default login.reducer;
