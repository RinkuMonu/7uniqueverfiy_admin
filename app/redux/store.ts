import { configureStore } from "@reduxjs/toolkit";
import AdminSlice from "./reducer/AdminSlice";

export const store = configureStore({
    reducer: {
        admin: AdminSlice
    }
})