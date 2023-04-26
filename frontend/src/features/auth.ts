import { createSlice } from "@reduxjs/toolkit";
import { RootState, authInitialStateType } from "../types";


const initialState:authInitialStateType={
    register:false,
    modalShow:false,
    sideBarUserID:""
}

const authSlice=createSlice({
    name:"authSlice",
    initialState,
    reducers:{
       signUpAction:(state,{payload})=>{
        state.register=payload
       },
       modalAction:(state,{payload:{modal,userID}})=>{
        state.modalShow=modal;
        state.sideBarUserID=userID
       },

    }
})

export const {signUpAction,modalAction}=authSlice.actions;

export const getSingupData=(state:RootState)=>state.auth.register;
export const getModalShow=(state:RootState)=>state.auth.modalShow;
export const getSideBarUserID=(state:RootState)=>state.auth.sideBarUserID;

export default authSlice.reducer;