import { combineReducers } from "redux";
import { meReducer } from "./userReducers";

export const reducers = combineReducers({
    me: meReducer
})

export type RootState = ReturnType<typeof reducers>
