import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loadingOverlaySliceData: {
    isOpened: false,
  },
};

export const loadingOverlaySlice = createSlice({
  name: "loadingOverlay",
  initialState,
  reducers: {
    openLoadingOverlay: (state) => {
      state.loadingOverlaySliceData.isOpened = true;
    },
    closeLoadingOverlay: (state) => {
      state.loadingOverlaySliceData.isOpened = false;
    },
  },
});

export const selectLoadingOverlayState = (state) =>
  state.loadingOverlay.loadingOverlaySliceData.isOpened;

// Export the actions to use them in the components
export const { openLoadingOverlay, closeLoadingOverlay } =
  loadingOverlaySlice.actions;

// Export the reducer to use it in the store
export default loadingOverlaySlice.reducer;
