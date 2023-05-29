import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";

export const groupApi=createApi({
    reducerPath:"groupApi",
    baseQuery:fetchBaseQuery({
        baseUrl:"/chat"
    }),
   endpoints:(builder)=>({
    createGroup:builder.mutation({
        query:(data)=>({
            url:"/createGroup",
            method:"POST",
            body:data
        })
    }),
    sendMessageGroup:builder.mutation({
        query:(data)=>({
            url:`/groupChat/${data.currentChat}`,
            method:"POST",
            body:data.formData
        })
    })
   })
})

export const {useCreateGroupMutation,useSendMessageGroupMutation}=groupApi