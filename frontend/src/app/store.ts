
import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth';
import { authApi } from './authApi';
import { chatApi } from './chatApi';
import { groupApi } from './groupApi';

 const store=configureStore({
    reducer:{
        auth:authReducer,
        [authApi.reducerPath]:authApi.reducer,
        [chatApi.reducerPath]:chatApi.reducer,
        [groupApi.reducerPath]:groupApi.reducer
    },
    middleware: (getDefaultMiddleware) =>getDefaultMiddleware().concat([authApi.middleware,chatApi.middleware,groupApi.middleware]),
});

export default store;

