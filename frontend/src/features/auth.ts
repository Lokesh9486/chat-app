import { createSlice } from "@reduxjs/toolkit";
import { RootState, authInitialStateType } from "../types";


const initialState:authInitialStateType={
    register:false
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

export const getSingupData=(state:RootState)=>state.auth.register;

export default authSlice.reducer;