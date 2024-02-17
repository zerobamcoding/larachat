import { SearchUserType, SendMessageType } from "../action-types/chat";
import { MessageResponse } from "../types/chat";
import { ThreadsList } from "../types/user";

interface SearchUserLoading {
    type: SearchUserType.SEARCH_LOADING
}

interface SearchUserSuccess {
    type: SearchUserType.SEARCH_SUCCESS
    payload: ThreadsList
}

interface SearchUserError {
    type: SearchUserType.SEARCH_ERROR
    payload: ThreadsList
}

export type SearchUserActions = SearchUserLoading |
    SearchUserSuccess |
    SearchUserError




interface SendMessageLoading {
    type: SendMessageType.SEND_MESSAGE_LOADING
}

interface SendMessageSuccess {
    type: SendMessageType.SEND_MESSAGE_SUCCESS
    payload: MessageResponse
}

interface SendMessageError {
    type: SendMessageType.SEND_MESSAGE_ERROR
    payload: MessageResponse
}

export type SendMessageActions = SendMessageLoading |
    SendMessageSuccess |
    SendMessageError
