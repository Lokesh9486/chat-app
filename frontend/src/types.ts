import store from "./app/store";

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export interface authInitialStateType{
    register:string
}

export interface signUpInterface {
    type: string;
    name: string;
    palceholder: string;
    value?: string;
  };

  export interface registerApiData{
      
  }