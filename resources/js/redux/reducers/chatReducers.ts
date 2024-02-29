import { SearchUserType, ChatsType } from "../action-types/chat";
import { SearchUserActions, ChatsActions } from "../actions/chat";
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

const chatsInit: ChatsState = {
    loading: false,
    threads: null
}


export const threadsReducer = (state: ChatsState = chatsInit, action: ChatsActions) => {
    switch (action.type) {
        case ChatsType.CHATS_LOADING:
            return { ...state, loading: true }
        case ChatsType.CHATS_GET_THREADS:
            return { loading: false, threads: action.payload.threads }
        case ChatsType.CHATS_ADD_MESSAGE:
            if (state.threads) {
                const editedThread = state.threads.findIndex(th => th.id === action.payload.message?.messageable_id)
                const newThread = { ...state.threads[editedThread], messages: [...state.threads[editedThread].messages, action.payload.message] }
                const oldThreads = state.threads.filter(th => th.id !== action.payload.message?.messageable_id)
                return { loading: false, threads: [newThread, ...oldThreads] }
            }

        case ChatsType.CHATS_ERROR:
            return { ...state, loading: false, errors: action.payload.errors }
        default:
            return state
    }
}
