import { createSlice } from "@reduxjs/toolkit";
import { RootState, authInitialStateType } from "../types";


const initialState:authInitialStateType={
    register:""
}

const authSlice=createSlice({
    name:"authSlice",
    initialState,
    reducers:{
       signUpAction:(state,{payload})=>{
        state.register=payload
       }
    }
})

export const {signUpAction}=authSlice.actions;

export const getSingupDat=(state:RootState)=>state.auth.register;

export default authSlice.reducer;