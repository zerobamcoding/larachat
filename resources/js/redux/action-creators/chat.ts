import { ThunkDispatch } from "redux-thunk";
import { SearchUserActions, ChatsActions } from "../actions/chat";
import { SearchUserType, ChatsType } from "../action-types/chat";
import apiClient from "@/libs/apiClient";
import { ThreadsList } from "../types/user";
import { SentMessageResponse } from "../types/chat";

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


interface MessageData {
    to: number;
    message: string
    replied?: number
}
export const sendMessage = (messageDate: MessageData) => async (dispatch: ThunkDispatch<{}, {}, ChatsActions>) => {
    dispatch({ type: ChatsType.CHATS_LOADING })

    try {
        const { data }: { data: SentMessageResponse } = await apiClient.post(route("chat.send"), messageDate)
        if (data && !data.success) {
            dispatch({ type: ChatsType.CHATS_ERROR, payload: data })
            return
        }
        dispatch({ type: ChatsType.CHATS_ADD_MESSAGE, payload: data })
    } catch (error) {
        console.log(error);

    }
}
