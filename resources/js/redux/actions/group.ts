import { MakeNewGroup } from "../action-types/group";
import { MakeNewGroupPayload } from "../types/group";

interface MakeNewGroupLoading {
    type: MakeNewGroup.MAKE_NEW_GROUP_LOADING
}

interface MakeNewGroupSuccess {
    type: MakeNewGroup.MAKE_NEW_GROUP_SUCCESS
    payload: MakeNewGroupPayload
}

interface MakeNewGroupError {
    type: MakeNewGroup.MAKE_NEW_GROUP_ERROR
    payload: MakeNewGroupPayload
}

export type MakeNewGroupActions =
    MakeNewGroupLoading |
    MakeNewGroupSuccess |
    MakeNewGroupError
