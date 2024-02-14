import { SearchUserType } from "../action-types/chat";
import { SearchUserActions } from "../actions/chat";
import { User, ValidationErrors } from "../types/user";

interface SearchUserState {
    loading: boolean;
    users: User[] | null
    errors?: ValidationErrors

}

const searchUserInit: SearchUserState = {
    loading: false,
    users: null
}



export const searchUserReducer = (state: SearchUserState = searchUserInit, action: SearchUserActions) => {
    switch (action.type) {
        case SearchUserType.SEARCH_LOADING:
            return { ...state, loading: true }
        case SearchUserType.SEARCH_SUCCESS:
            return { ...state, loading: false, users: action.payload.users }
        case SearchUserType.SEARCH_ERROR:
            return { ...state, loading: false, errors: action.payload.errors }
        default:
            return state
    }
}
