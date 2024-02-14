import { combineReducers } from "redux";
import { meReducer } from "./userReducers";
import { searchUserReducer } from "./chatReducers";

export const reducers = combineReducers({
    me: meReducer,
    search: searchUserReducer
})

export type RootState = ReturnType<typeof reducers>
