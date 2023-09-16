import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default: localStorage for web

import staffReducer from "./slices/staffSlice";
import snackbarReducer from "./slices/snackbarSlice";
import loadingOverlayReducer from "./slices/loadingOverlaySlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = {
  staff: staffReducer,
  snackbar: snackbarReducer,
  loadingOverlay: loadingOverlayReducer,
};

const persistedReducer = {};
for (let key in rootReducer) {
  persistedReducer[key] = persistReducer(persistConfig, rootReducer[key]);
}

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [
        "persist/PERSIST",
        "persist/REHYDRATE" /* any other redux-persist actions */,
      ],
    },
  }),
});

let persistor = persistStore(store);

export { store, persistor };

// import { configureStore } from "@reduxjs/toolkit";
// import staffReducer from "./slices/staffSlice";
// import snackbarReducer from "./slices/snackbarSlice";
// import loadingOverlayReducer from "./slices/loadingOverlaySlice";

// export default configureStore({
//   reducer: {
//     staff: staffReducer,
//     snackbar: snackbarReducer,
//     loadingOverlay: loadingOverlayReducer,
//   },
// });
