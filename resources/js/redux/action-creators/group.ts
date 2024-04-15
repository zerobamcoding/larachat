import { ThunkDispatch } from "redux-thunk";
import apiClient from "@/libs/apiClient";
import { MakeNewGroupActions } from "../actions/group";
import { MakeNewGroup } from "../action-types/group";
import { MakeNewGroupPayload } from "../types/group";

export const makeNewGroupAction = (name: string, users: number[]) => async (dispatch: ThunkDispatch<{}, {}, MakeNewGroupActions>) => {
    dispatch({ type: MakeNewGroup.MAKE_NEW_GROUP_LOADING })

    try {
        const { data }: { data: MakeNewGroupPayload } = await apiClient.post(route("group.new"), { name, users })
        if (data && !data.success) {
            dispatch({ type: MakeNewGroup.MAKE_NEW_GROUP_ERROR, payload: data })
            return
        }
        dispatch({ type: MakeNewGroup.MAKE_NEW_GROUP_SUCCESS, payload: data })
    } catch (error) {
        console.log(error);

    }
}
