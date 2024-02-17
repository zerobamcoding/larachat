import { ThunkDispatch } from "redux-thunk";
import { SearchUserActions, SendMessageActions } from "../actions/chat";
import { SearchUserType, SendMessageType } from "../action-types/chat";
import apiClient from "@/libs/apiClient";
import { ThreadsList } from "../types/user";
import { MessageResponse } from "../types/chat";

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


interface SendMessageData {
    message: string
    user_to: number
    replied?: number
}
export const sendMessage = (messageData: SendMessageData) => async (dispatch: ThunkDispatch<{}, {}, SendMessageActions>) => {
    dispatch({ type: SendMessageType.SEND_MESSAGE_LOADING })

    try {
        const { data }: { data: MessageResponse } = await apiClient.post(route("chat.send"), messageData)
        if (data && !data.success) {
            dispatch({ type: SendMessageType.SEND_MESSAGE_ERROR, payload: data })
            return
        }
        dispatch({ type: SendMessageType.SEND_MESSAGE_SUCCESS, payload: data })
    } catch (error) {
        console.log(error);

    }
}
