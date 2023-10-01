import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

import staffReducer from "./slices/staffSlice";
import snackbarReducer from "./slices/snackbarSlice";
import loadingOverlayReducer from "./slices/loadingOverlaySlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["loadingOverlay", "snackbar"],
};

const rootReducer = combineReducers({
  staff: staffReducer,
  snackbar: snackbarReducer,
  loadingOverlay: loadingOverlayReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

let persistor = persistStore(store);

export { store, persistor };
