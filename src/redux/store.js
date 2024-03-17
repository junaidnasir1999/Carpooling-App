import { configureStore } from "@reduxjs/toolkit";

// import storage from "redux-persist/lib/storage";
import { combineReducers } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import thunk from "redux-thunk";
import persistStore from "redux-persist/es/persistStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

import AuthSlice from "./AuthSlice";

const reducers = combineReducers({
    authData: AuthSlice,
})
    
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['authData'],
    blacklist: ['authData.loading']
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: [thunk],
})

export const persistor = persistStore(store)