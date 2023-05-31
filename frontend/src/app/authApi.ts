import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface foundUser {
    _id: string,
    name: string,
    email: string,
    profile: string,
    active:Date
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
    login: builder.mutation<
      string,
      { [email: string]: string; password: string }
    >({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
    }),
    otpVerification: builder.mutation<string, { email: string; otp: string }>({
      query: (data) => ({
        url: "/otpVerify",
        method: "POST",
        body: data,
      }),
    }),
    getUserProfile: builder.query<any, void>({
      query: () => "/getuser",
    }),
    searchUser: builder.query<{ email: string; name: string; _id:string,profile:string }[], string>({
      query: (data) => `/search/${data}`,
    }),
    foundUser:builder.query<foundUser,string>({
      query: (data) => `/get-single-user/${data}`,
    }),
    logoutUser:builder.query({
      query:()=>`/logout`
    })
  }),
});

export const {
  useRegisterMutation,
  useOtpVerificationMutation,
  useLoginMutation,
  useGetUserProfileQuery,
  useSearchUserQuery,
  useFoundUserQuery,
  useLogoutUserQuery
} = authApi;
