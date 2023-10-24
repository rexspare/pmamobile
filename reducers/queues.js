import { mergeById, updateById } from "../utils/helpers";
import { createSlice, current } from "@reduxjs/toolkit";
import compact from "lodash/compact";
const initialState = [];

export const queues = createSlice({
    name: "queues",
    initialState,
    reducers: {
        addQueues: (state, action) => {
            return compact(mergeById(state, action.payload, "_id"));
        },
        addQueue: (state, action) => {
            return compact(mergeById(state, [action.payload], "_id"));
        },
        updateQueue: (state, action) => {
            if (state) return compact(updateById(state, action.payload, "_id"));
        },
        deleteQueue: (state, action) => {
            return state.filter((queue) => queue._id !== action.payload);
        },
    },
});

export const { addQueues, addQueue, updateQueue, deleteQueue } = queues.actions;

export default queues.reducer;
