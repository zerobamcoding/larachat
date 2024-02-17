import { combineReducers } from "redux";
import { meReducer } from "./userReducers";
import { searchUserReducer, chatsReducer } from "./chatReducers";

export const reducers = combineReducers({
    me: meReducer,
    search: searchUserReducer,
    threads: chatsReducer
})

export type RootState = ReturnType<typeof reducers>
