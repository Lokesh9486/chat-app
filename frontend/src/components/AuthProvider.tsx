import { Children } from "react";
import { useGetChatDetailsQuery } from "../app/chatApi";
import { Navigate } from "react-router-dom";



const AuthProvider=({children}:{children:JSX.Element})=>{
    const {
        data, isError, isFetching, isLoading, isSuccess
      } = useGetChatDetailsQuery();
      if(isError){
        return <Navigate to="/signin"/>
      }
      return children
}

export default AuthProvider;