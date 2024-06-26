import { SearchUserType, ChatsType, OnlineUsersType } from "../action-types/chat";
import { Channel, GetChannelMembersPayload } from "../types/channel";
import { ChatJoinPayload, PaginatedMessages, SentMessageResponse, ThreadsResponse } from "../types/chat";
import { GetGroupMembersPayload, Group, RemoveMessagePayload } from "../types/group";
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

interface seenMessageSuccess {
    type: ChatsType.CHATS_SEEN_MESSAGE
    payload: SentMessageResponse
}

interface loadMoreMessagesSuccess {
    type: ChatsType.CHATS_LOAD_MORE_MESSAGES,
    payload: PaginatedMessages
}

interface AddToGroup {
    type: ChatsType.CHATS_ADD_TO_GROUP,
    payload: Group
}

interface AddToChannel {
    type: ChatsType.CHATS_ADD_TO_CHANNEL,
    payload: Channel
}

interface RemoveMessage {
    type: ChatsType.CHATS_REMOVE_MESSAGE,
    payload: RemoveMessagePayload
}


interface GetGroupMembers {
    type: ChatsType.CHATS_GET_GROUP_MEMBERS,
    payload: GetGroupMembersPayload
}

interface GetChannelMembers {
    type: ChatsType.CHATS_GET_CHANNEL_MEMBERS,
    payload: GetChannelMembersPayload
}

interface JoinThread {
    type: ChatsType.CHATS_JOIN,
    payload: ChatJoinPayload
}


interface ChatsError {
    type: ChatsType.CHATS_ERROR
    payload: { errors: ValidationErrors }
}

interface ClearChats {
    type: ChatsType.CLEAR_THREADS
}

export type ChatsActions =
    ChatsLoading |
    getThreadsSuccess |
    SendMessageSuccess |
    pinMessageSuccess |
    seenMessageSuccess |
    RemoveMessage |
    AddToGroup |
    AddToChannel |
    JoinThread |
    GetGroupMembers |
    GetChannelMembers |
    loadMoreMessagesSuccess |
    ChatsError |
    ClearChats


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
