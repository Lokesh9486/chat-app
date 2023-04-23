import store from "./app/store";

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export interface authInitialStateType {
  register: boolean;
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
  createdAt: Date;
  id:string
}
export interface registerApiData {
  _id: string;
  name: string;
  message: messageType[];
}


export interface sidebarDataType{name: string, lastmessage: string,id:string}