import { ThunkDispatch } from "redux-thunk";
import { MeActions } from "../actions/user";
import { AvatarTypes, MeTypes } from "../action-types/user";
import apiClient from "@/libs/apiClient";
import { AuthPayload } from "../types/user";

export const getMeAction = () => async (dispatch: ThunkDispatch<{}, {}, MeActions>) => {
    dispatch({ type: MeTypes.ME_LOADING })

    try {
        const { data }: { data: AuthPayload } = await apiClient.post('/user/me')

        dispatch({ type: MeTypes.ME_SUCCESS, payload: data })
    } catch (error) {
        console.log(error);

    }
}

export const changeAvatar = (formData: FormData) => async (dispatch: ThunkDispatch<{}, {}, MeActions>) => {
    dispatch({ type: MeTypes.ME_LOADING })

    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const { data }: { data: AuthPayload } = await apiClient.post('/user/avatar', formData, config)

        dispatch({ type: MeTypes.ME_SUCCESS, payload: data })
    } catch (error) {
        console.log(error);

    }
}
