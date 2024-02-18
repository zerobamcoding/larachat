import { combineReducers } from "redux";
import { meReducer } from "./userReducers";
import { searchUserReducer, threadsReducer } from "./chatReducers";

export const reducers = combineReducers({
    me: meReducer,
    search: searchUserReducer,
    threads: threadsReducer
})

export type RootState = ReturnType<typeof reducers>
