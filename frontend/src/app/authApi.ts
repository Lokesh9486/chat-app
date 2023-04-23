import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface register {
  name: string | undefined;
  email: string | undefined;
  password: string | undefined;
  profile: any;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/chat",
  }),
  endpoints: (builder) => ({
    register: builder.mutation<string, FormData>({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
    }),
    login:builder.mutation<string,{[email:string]:string,password:string}>({
      query:(data)=>({
        url:"/login",
        method:"POST",
        body:data
      })
    }),
    otpVerification: builder.mutation<string, { email: string; otp: string }>({
      query: (data) => ({
        url: "/otpVerify",
        method: "POST",
        body: data,
      }),
    }),
    getUserProfile:builder.query<any,void>({
      query:()=>"/getuser"
    }),
    searchUser:builder.query<any,string>({
      query:(data)=>`/search/${data}`
    })
  }),
});

export const { useRegisterMutation, useOtpVerificationMutation,useLoginMutation,useGetUserProfileQuery,useSearchUserQuery } = authApi;
