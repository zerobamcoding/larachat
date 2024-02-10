import { MeTypes, AvatarTypes } from "../action-types/user";
import { AuthPayload } from "../types/user";

interface MeLoadingAction {
    type: MeTypes.ME_LOADING
}

interface MeSuccessAction {
    type: MeTypes.ME_SUCCESS,
    payload: AuthPayload
}

interface MeErrorAction {
    type: MeTypes.ME_ERROR
    payload: AuthPayload
}

export type MeActions = MeLoadingAction |
    MeSuccessAction |
    MeErrorAction

