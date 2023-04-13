import { configureStore } from "@reduxjs/toolkit";

export const store=configureStore({
    reducer:{

    }
})

export type RoootState=ReturnType<typeof store.getState>

export type AppDispatch=typeof store.dispatch