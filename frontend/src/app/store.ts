
import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth';
import { authApi } from './authApi';
import { chatApi } from './chatApi';

 const store=configureStore({
    reducer:{
        auth:authReducer,
        [authApi.reducerPath]:authApi.reducer,
        [chatApi.reducerPath]:chatApi.reducer
    },
    middleware: (getDefaultMiddleware) =>getDefaultMiddleware().concat(authApi.middleware,chatApi.middleware),
});

export default store;

