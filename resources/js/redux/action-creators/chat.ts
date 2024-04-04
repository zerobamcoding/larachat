import { ThunkDispatch } from "redux-thunk";
import { SearchUserActions, ChatsActions, OnlineUsersActions } from "../actions/chat";
import { SearchUserType, ChatsType, OnlineUsersType } from "../action-types/chat";
import apiClient from "@/libs/apiClient";
import { ThreadsList } from "../types/user";
import { Message, SentMessageResponse, ThreadsResponse } from "../types/chat";

export const searchUser = (q: string) => async (dispatch: ThunkDispatch<{}, {}, SearchUserActions>) => {
    dispatch({ type: SearchUserType.SEARCH_LOADING })

    try {
        const { data }: { data: ThreadsList } = await apiClient.post(route("chat.search"), { q })
        if (data && !data.success) {
            dispatch({ type: SearchUserType.SEARCH_ERROR, payload: data })
            return
        }
        dispatch({ type: SearchUserType.SEARCH_SUCCESS, payload: data })
    } catch (error) {
        console.log(error);

    }
}



export const sendMessage = (messageDate: FormData) => async (dispatch: ThunkDispatch<{}, {}, ChatsActions>) => {
    dispatch({ type: ChatsType.CHATS_LOADING })

    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const { data }: { data: SentMessageResponse } = await apiClient.post(route("chat.send"), messageDate, config)
        if (data && !data.success && data.errors) {
            dispatch({ type: ChatsType.CHATS_ERROR, payload: { errors: data.errors } })
            return
        }
        dispatch({ type: ChatsType.CHATS_ADD_MESSAGE, payload: data })
    } catch (error) {
        console.log(error);

    }
}


export const addMessage = (message: Message) => async (dispatch: ThunkDispatch<{}, {}, ChatsActions>) => {
    dispatch({ type: ChatsType.CHATS_LOADING })

    try {
        dispatch({ type: ChatsType.CHATS_ADD_MESSAGE, payload: { success: true, message } })
    } catch (error) {
        console.log(error);

    }
}

export const pinMessage = (id: number, pin: boolean) => async (dispatch: ThunkDispatch<{}, {}, ChatsActions>) => {
    dispatch({ type: ChatsType.CHATS_LOADING })

    try {
        const { data }: { data: SentMessageResponse } = await apiClient.post(route("chat.pin"), { id, pin })
        if (data && !data.success && data.errors) {
            dispatch({ type: ChatsType.CHATS_ERROR, payload: { errors: data.errors } })
            return
        }

        dispatch({ type: ChatsType.CHATS_PIN_MESSAGE, payload: data })

    } catch (error) {
        console.log(error);

    }
}

export const getThreads = () => async (dispatch: ThunkDispatch<{}, {}, ChatsActions>) => {
    dispatch({ type: ChatsType.CHATS_LOADING })

    try {
        const { data }: { data: ThreadsResponse } = await apiClient.get(route("chat.threads"))
        if (data && !data.success && data.errors) {
            dispatch({ type: ChatsType.CHATS_ERROR, payload: { errors: data.errors } })
            return
        }
        dispatch({ type: ChatsType.CHATS_GET_THREADS, payload: data })
    } catch (error) {
        console.log(error);

    }
}


export const addOnlineUsersAction = (data: number[]) => async (dispatch: ThunkDispatch<{}, {}, OnlineUsersActions>) => {
    dispatch({ type: OnlineUsersType.ADD_ONLINE_USERS, payload: data })
}

export const removeOfflineUsersAction = (data: number[]) => async (dispatch: ThunkDispatch<{}, {}, OnlineUsersActions>) => {
    dispatch({ type: OnlineUsersType.REMOVE_OFFLINE_USERS, payload: data })
}
