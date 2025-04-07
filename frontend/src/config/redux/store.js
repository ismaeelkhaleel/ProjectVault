import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer/index";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
 

const persistConfig = {
  key: "auth",
  storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);