import { SearchUserType, ChatsType, OnlineUsersType } from "../action-types/chat";
import { SearchUserActions, ChatsActions, OnlineUsersActions } from "../actions/chat";
import { Direct } from "../types/chat";
import { Group } from "../types/group";
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


interface OnlineUsersState {
    users: number[]
}

const onlineUsersInit: OnlineUsersState = {
    users: []
}



export const onlinesUsersReducer = (state: OnlineUsersState = onlineUsersInit, action: OnlineUsersActions) => {
    switch (action.type) {
        case OnlineUsersType.ADD_ONLINE_USERS:
            return { users: [...state.users, ...action.payload] }
        case OnlineUsersType.REMOVE_OFFLINE_USERS:
            let newIds: number[] = []
            state.users.map(u => {
                if (!action.payload.includes(u)) {
                    newIds.push(u)
                }
            })
            return { users: newIds }

        default:
            return state
    }
}
interface ChatsState {
    loading: boolean;
    threads: (Direct | Group)[] | null
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
                const editedThread = state.threads.findIndex(th => th.id === action.payload.message?.messageable_id && action.payload.message.messageable_type === `App\\Models\\${th.type}`)
                if (editedThread >= 0) {
                    const isExistMessage = state.threads[editedThread].messages?.findIndex(m => m.id === action.payload.message?.id)
                    if (isExistMessage === -1) {

                        //@ts-ignore
                        const newThread: Direct = { ...state.threads[editedThread], messages: [...state.threads[editedThread].messages, action.payload.message] }
                        if (action.payload.from && action.payload.from === "other") {
                            newThread["unreaded_messages"] = newThread["unreaded_messages"] + 1;
                        }
                        const oldThreads = state.threads.filter(th => th.id !== action.payload.message?.messageable_id)
                        return { loading: false, threads: [newThread, ...oldThreads] }
                    }
                } else {
                    if (action.payload.message) {
                        const newThread: Direct = { ...action.payload.message?.messageable, "messages": [action.payload.message] }
                        return { loading: false, threads: [newThread, ...state.threads] }
                    }
                }
            }
            return { ...state }

        case ChatsType.CHATS_ADD_TO_GROUP:
            if (state.threads) {
                return { loading: false, threads: [action.payload, ...state.threads] }
            }
            return { ...state }
        case ChatsType.CHATS_PIN_MESSAGE:
            if (state.threads) {
                const threads = [...state.threads]
                const editedThread = state.threads.findIndex(th => th.id === action.payload.message?.messageable_id)

                if (editedThread >= 0) {
                    const updatedMessage = state.threads[editedThread].messages?.map(m => { if (m.id === action.payload.message?.id) { return action.payload.message } else { return m } })
                    threads[editedThread].messages = updatedMessage
                    return { loading: false, threads }
                }
            }
            return { ...state }

        case ChatsType.CHATS_SEEN_MESSAGE:
            if (state.threads) {
                const threads = [...state.threads]
                const editedThread = state.threads.findIndex(th => th.id === action.payload.message?.messageable_id)

                if (editedThread >= 0) {
                    const updatedMessage = state.threads[editedThread].messages?.map(m => { if (m.id === action.payload.message?.id) { return action.payload.message } else { return m } })
                    threads[editedThread].messages = updatedMessage
                    threads[editedThread].unreaded_messages = threads[editedThread].unreaded_messages - 1
                    return { loading: false, threads }
                }
            }
            return { ...state }

        case ChatsType.CHATS_LOAD_MORE_MESSAGES:
            if (state.threads) {
                const threads = [...state.threads]
                const editedThread = state.threads.findIndex(th => th.id === action.payload.direct)

                if (editedThread >= 0) {
                    threads[editedThread].messages = [...action.payload.messages, ...threads[editedThread].messages]
                    threads[editedThread].page = action.payload.page
                    threads[editedThread].has_more = action.payload.has_more

                    return { loading: false, threads }
                }
            }
            return { ...state }

        case ChatsType.CHATS_ERROR:
            return { ...state, loading: false, errors: action.payload.errors }
        default:
            return state
    }
}
