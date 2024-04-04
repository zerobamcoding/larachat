import { combineReducers } from "redux";
import { meReducer } from "./userReducers";
import { onlinesUsersReducer, searchUserReducer, threadsReducer } from "./chatReducers";

export const reducers = combineReducers({
    me: meReducer,
    search: searchUserReducer,
    threads: threadsReducer,
    onlines: onlinesUsersReducer
})

export type RootState = ReturnType<typeof reducers>
