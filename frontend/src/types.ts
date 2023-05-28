import store from "./app/store";

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export interface authInitialStateType {
  register: boolean;
  modalShow: boolean;
  sideBarUserID:string
}

export interface signUpInterface {
  type: string;
  name: string;
  palceholder: string;
  value: any;
  error: boolean;
  errMessage: string;
}

export interface messageType {
  type: string;
  message: string;
  image?:string;
  location?:{
    type: string, coordinates: number[]
  }
  createdAt: Date;
  id:string
}
export interface registerApiData {
  _id: string;
  name: string;
  active:string;
  message: messageType[];
  profile:string,
  created_by?:string,
  created_at?:Date,
  description?:string,
  group?:boolean,
}


export interface sidebarDataType{
  name: string, 
  lastmessage: string,
  id:string,
  active:boolean,
  profile:string,
  image:boolean
  location:boolean
}