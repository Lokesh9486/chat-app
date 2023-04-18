import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { nanoid } from '@reduxjs/toolkit';

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
    // prepareHeaders: (headers, { getState }) => {
    //   const boundaryString = `multipart/form-data; boundary=${nanoid()}`;
    //   headers.set('Content-Type', boundaryString);
    //   return headers;
    // },
  }),
  endpoints: (builder) => ({
    register: builder.mutation<string, FormData>({
      query: (data) => (
        console.log(data),
      {
        url: "/register",
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
  }),
});

export const { useRegisterMutation, useOtpVerificationMutation } = authApi;
