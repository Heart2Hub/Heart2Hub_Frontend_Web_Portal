import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  snackbarSliceData: {
    color: "info",
    icon: "",
    title: "",
    content: "",
    dateTime: new Date().toLocaleTimeString(),
    isOpen: false,
  },
};

export const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    displayMessage: (state, action) => {
      const { color, icon, title, content } = action.payload;

      state.snackbarSliceData.color = color || initialState.snackbarData.color;
      state.snackbarSliceData.icon = icon || initialState.snackbarData.icon;
      state.snackbarSliceData.title = title || initialState.snackbarData.title;
      state.snackbarSliceData.content =
        content || initialState.snackbarData.content;
      state.snackbarSliceData.dateTime = new Date().toLocaleTimeString();
      state.snackbarSliceData.isOpen = true;
    },
    closeMessage: (state) => {
      state.snackbarSliceData.isOpen = false;
    },
  },
});

export const selectSnackbar = (state) => state.snackbar.snackbarSliceData;

// Export the actions to use them in the components
export const { displayMessage, closeMessage } = snackbarSlice.actions;

// Export the reducer to use it in the store
export default snackbarSlice.reducer;
