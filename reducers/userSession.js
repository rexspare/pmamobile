import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import get from "lodash/get";
import dayjs from "dayjs";
import DashboardServer from "../api/DashboardServer";
import { getCompany } from "./company";
import { setPermissions } from "./permissions";
import { setStatusOperator } from "./statusOperator";
import { setIsLogged } from "./login";

const { initialState } = {
    initialState: {},
};

export const getUserSession = createAsyncThunk("userSession/getUserSession", async (type, thunkAPI, signal) => {
    const dispatch = thunkAPI.dispatch;
    const token = await AsyncStorage.getItem("@bearerToken");

    const {
        data: { data },
    } = await DashboardServer.get("/auth/me");

    const operatorActive = data?.operatorActive;
    dispatch(setPermissions(get(data, "permissions", [])));
    dispatch(setStatusOperator(operatorActive));
    dispatch(getCompany());

    try {
        dayjs.tz?.setDefault(data?.timezone);
    } catch (err) {
        console.log("Error usersession dayjs", err);
    }

    return data;
});

const userSession = createSlice({
    name: "userSession",
    initialState,
    reducers: {
        setUserSession: (state, action) => {
            const userSession = action.payload;
            return userSession;
        },
        updateUserSession: (state, action) => {
            const userSession = action.payload;
            return { ...state, ...userSession };
        },
        destroyUserSession: () => {
            return {};
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getUserSession.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});

export const { setUserSession, updateUserSession, destroyUserSession } = userSession.actions;

export default userSession.reducer;
