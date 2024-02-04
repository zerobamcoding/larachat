import { ThunkDispatch } from "redux-thunk";
import { MeActions } from "../actions/user";
import { MeTypes } from "../action-types/user";

export const getMeAction = () => (dispatch: ThunkDispatch<{}, {}, MeActions>) => {
    dispatch({ type: MeTypes.ME_LOADING })

    try {
        // api => request

        dispatch({ type: MeTypes.ME_SUCCESS, payload: { success: true, user: { id: 1, mobile: 123, username: "mahdi" } } })
    } catch (error) {
        console.log(error);

    }
}
