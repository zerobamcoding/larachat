import { createStore, applyMiddleware, compose } from "redux";
import { reducers } from "./reducers";
import { thunk } from "redux-thunk"

const middlewares = [thunk]
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(
    applyMiddleware(...middlewares),
    // other store enhancers if any
);
export const store = createStore(reducers, {}, enhancer)
