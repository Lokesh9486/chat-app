import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface register {
  name: string|undefined;
  email: string|undefined;
  password: string|undefined;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/chat" }),
  endpoints: (builder) => ({
    register: builder.mutation<string,register>({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useRegisterMutation } = authApi;
