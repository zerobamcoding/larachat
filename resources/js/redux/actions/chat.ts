import { SearchUserType, ChatsType, OnlineUsersType } from "../action-types/chat";
import { SentMessageResponse, ThreadsResponse } from "../types/chat";
import { ThreadsList, ValidationErrors } from "../types/user";

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

interface getThreadsSuccess {
    type: ChatsType.CHATS_GET_THREADS
    payload: ThreadsResponse
}

interface pinMessageSuccess {
    type: ChatsType.CHATS_PIN_MESSAGE
    payload: SentMessageResponse
}
interface ChatsError {
    type: ChatsType.CHATS_ERROR
    payload: { errors: ValidationErrors }
}

export type ChatsActions =
    ChatsLoading |
    getThreadsSuccess |
    SendMessageSuccess |
    pinMessageSuccess |
    ChatsError


interface AddOnlineUsers {
    type: OnlineUsersType.ADD_ONLINE_USERS,
    payload: number[]
}

interface RemoveOfflineUsers {
    type: OnlineUsersType.REMOVE_OFFLINE_USERS,
    payload: number[]
}

export type OnlineUsersActions = AddOnlineUsers |
    RemoveOfflineUsers
