import { configureStore } from "@reduxjs/toolkit";
import staffReducer from "./slices/staffSlice";
import snackbarReducer from "./slices/snackbarSlice";

export default configureStore({
  reducer: {
    staff: staffReducer,
    snackbar: snackbarReducer,
  },
});
