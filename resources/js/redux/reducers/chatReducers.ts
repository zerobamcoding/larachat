import { SearchUserType, SendMessageType } from "../action-types/chat";
import { SearchUserActions, SendMessageActions } from "../actions/chat";
import { Direct } from "../types/chat";
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

interface ChatsState {
    loading: boolean;
    threads: Direct[] | null
    errors?: ValidationErrors

}

const chatInit: ChatsState = {
    loading: false,
    threads: null
}



export const chatsReducer = (state: ChatsState = chatInit, action: SendMessageActions) => {
    switch (action.type) {
        case SendMessageType.SEND_MESSAGE_LOADING:
            return { ...state, loading: true }
        case SendMessageType.SEND_MESSAGE_SUCCESS:
            if (state.threads) {
                const oldDirects = state.threads.filter(th => th.id !== action.payload.conversation.id)
                return { ...state, loading: false, threads: [action.payload.conversation, oldDirects] }

            }
        case SendMessageType.SEND_MESSAGE_ERROR:
            return { ...state, loading: false, errors: action.payload.errors }
        default:
            return state
    }
}
