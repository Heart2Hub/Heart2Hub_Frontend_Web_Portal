import { configureStore } from "@reduxjs/toolkit";
import staffReducer from "./slices/staffSlice";

export default configureStore({
  reducer: {
    staff: staffReducer,
  },
});
