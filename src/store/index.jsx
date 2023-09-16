import { configureStore } from "@reduxjs/toolkit";
import staffReducer from "./slices/staffSlice";
import snackbarReducer from "./slices/snackbarSlice";
import loadingOverlayReducer from "./slices/loadingOverlaySlice";

export default configureStore({
  reducer: {
    staff: staffReducer,
    snackbar: snackbarReducer,
    loadingOverlay: loadingOverlayReducer,
  },
});
