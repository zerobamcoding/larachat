import { MeTypes } from "../action-types/user"
import { MeActions } from "../actions/user"
import { User, ValidationErrors } from "../types/user"

interface MeState {
    loading: boolean
    user: User | null
    errors?: ValidationErrors
}

const meInitialState: MeState = {
    loading: false,
    user: null
}
export const meReducer = (state: MeState = meInitialState, action: MeActions) => {
    switch (action.type) {
        case MeTypes.ME_LOADING:
            return { ...state, loading: true }
        case MeTypes.ME_SUCCESS:
            return { ...state, loading: false, user: action.payload.user }
        case MeTypes.ME_ERROR:
            return { ...state, loading: false, errors: action.payload.errors }
        case MeTypes.CLEAR_ME:
            return { loading: false, errors: [], user: null }
        default:
            return state
    }
}


