import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
    name: "notifications",
    initialState: {
        isOpen: false,
        message: '',
        type: "success",
    },
    reducers: {
        addNotification: (state, action) => {
            state.isOpen = true;
            state.message = action.payload.message;
            state.type = action.payload.type || "success";
        },
        removeNotification: (state) => {
            state.isOpen = false;
        },
    },
});

export const { addNotification, removeNotification } = notificationSlice.actions;
export default notificationSlice.reducer;