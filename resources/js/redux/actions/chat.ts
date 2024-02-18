import { SearchUserType, ChatsType } from "../action-types/chat";
import { SentMessageResponse } from "../types/chat";
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



interface ChatsLoading {
    type: ChatsType.CHATS_LOADING
}

interface SendMessageSuccess {
    type: ChatsType.CHATS_ADD_MESSAGE
    payload: SentMessageResponse
}

interface ChatsError {
    type: ChatsType.CHATS_ERROR
    payload: SentMessageResponse
}

export type ChatsActions = ChatsLoading |
    SendMessageSuccess |
    ChatsError

