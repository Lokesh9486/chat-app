import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { getAllUser, getSingleGroup } from "../types";

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
    }),
    getAllUser:builder.query<getAllUser[],void>({
        query:()=> `/getalluser`
    }),
    getSingleGroup:builder.query<getSingleGroup[],string>({
        query:(data)=>`/group/${data}`
    }),
    deleteGroupMessage:builder.mutation({
        query:(data)=>({
            url:`/group/message/delete/${data}`,
            method:"DELETE"
        })
    })
   })
})

export const {useCreateGroupMutation,useSendMessageGroupMutation,
    useGetAllUserQuery,
    useGetSingleGroupQuery,
    useDeleteGroupMessageMutation
}=groupApi