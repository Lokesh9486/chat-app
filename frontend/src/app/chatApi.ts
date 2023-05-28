import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { registerApiData } from "../types";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/chat",
  }),
  endpoints: (builder) => ({
    getChatDetails: builder.query<registerApiData[],any>({
      query: () => "/message",
    }),
    sendMessage: builder.mutation({
      query:(data)=>({
        url: `/message/${data.currentChat}`,
        method:"POST",
        body:data.formData
      })
    }),
    deleteMessage:builder.mutation({
       query:(data)=>({
        url:`/message/delete`,
        method:"DELETE",
        body:{id:data}
       })
    })
  }),
});

export const { useGetChatDetailsQuery,useSendMessageMutation,useDeleteMessageMutation } = chatApi;
