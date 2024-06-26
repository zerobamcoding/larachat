import { ThunkDispatch } from "redux-thunk";
import { SearchUserActions, ChatsActions, OnlineUsersActions } from "../actions/chat";
import { SearchUserType, ChatsType, OnlineUsersType } from "../action-types/chat";
import apiClient from "@/libs/apiClient";
import { ThreadsList } from "../types/user";
import { ChatJoinPayload, Message, PaginatedMessages, SentMessageResponse, ThreadsResponse } from "../types/chat";
import { GetGroupMembersPayload, Group, RemoveMessagePayload } from "../types/group";
import { Channel } from "../types/channel";

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


export const addedToGroupAction = (group: Group) => async (dispatch: ThunkDispatch<{}, {}, ChatsActions>) => {
    dispatch({ type: ChatsType.CHATS_LOADING })

    try {

        dispatch({ type: ChatsType.CHATS_ADD_TO_GROUP, payload: group })
    } catch (error) {
        console.log(error);

    }
}

export const addedToChannelAction = (channel: Channel) => async (dispatch: ThunkDispatch<{}, {}, ChatsActions>) => {
    dispatch({ type: ChatsType.CHATS_LOADING })

    try {

        dispatch({ type: ChatsType.CHATS_ADD_TO_CHANNEL, payload: channel })
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


export const addMessage = (message: Message, from: string = "me") => async (dispatch: ThunkDispatch<{}, {}, ChatsActions>) => {
    dispatch({ type: ChatsType.CHATS_LOADING })

    try {
        dispatch({ type: ChatsType.CHATS_ADD_MESSAGE, payload: { success: true, message, from } })
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

export const seenMessage = (id: number) => async (dispatch: ThunkDispatch<{}, {}, ChatsActions>) => {
    dispatch({ type: ChatsType.CHATS_LOADING })

    try {
        const { data }: { data: SentMessageResponse } = await apiClient.post(route("chat.seen"), { id })
        if (data && !data.success && data.errors) {
            dispatch({ type: ChatsType.CHATS_ERROR, payload: { errors: data.errors } })
            return
        }

        dispatch({ type: ChatsType.CHATS_SEEN_MESSAGE, payload: data })

    } catch (error) {
        console.log(error);

    }
}


export const loadMoreMessage = (id: number, model: string, page: number) => async (dispatch: ThunkDispatch<{}, {}, ChatsActions>) => {
    dispatch({ type: ChatsType.CHATS_LOADING })

    try {
        const { data }: { data: PaginatedMessages } = await apiClient.post(route("chat.loadmore"), { id, model, page })
        // if (data && !data.success && data.errors) {
        //     dispatch({ type: ChatsType.CHATS_ERROR, payload: { errors: data.errors } })
        //     return
        // }

        dispatch({ type: ChatsType.CHATS_LOAD_MORE_MESSAGES, payload: data })

    } catch (error) {
        console.log(error);

    }
}

export const removeMessageAction = (id: number) => async (dispatch: ThunkDispatch<{}, {}, ChatsActions>) => {
    dispatch({ type: ChatsType.CHATS_LOADING })

    try {
        const { data }: { data: RemoveMessagePayload } = await apiClient.post(route("chat.remove.message"), { id })
        if (data && !data.success && data.errors) {
            dispatch({ type: ChatsType.CHATS_ERROR, payload: { errors: data.errors } })
            return
        }

        dispatch({ type: ChatsType.CHATS_REMOVE_MESSAGE, payload: data })

    } catch (error) {
        console.log(error);

    }
}


export const joinThreadAction = (type: string, id: number) => async (dispatch: ThunkDispatch<{}, {}, ChatsActions>) => {
    dispatch({ type: ChatsType.CHATS_LOADING })

    try {
        const { data }: { data: ChatJoinPayload } = await apiClient.post(route("chat.join"), { type, id })
        if (data && !data.success && data.errors) {
            dispatch({ type: ChatsType.CHATS_ERROR, payload: { errors: data.errors } })
            return
        }

        dispatch({ type: ChatsType.CHATS_JOIN, payload: data })

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


export const getGroupMembersAction = (id: number) => async (dispatch: ThunkDispatch<{}, {}, ChatsActions>) => {
    dispatch({ type: ChatsType.CHATS_LOADING })

    try {
        const { data }: { data: GetGroupMembersPayload } = await apiClient.get(route("group.members", { id }))
        if (data && data.success) {

            dispatch({ type: ChatsType.CHATS_GET_GROUP_MEMBERS, payload: data })
        }
    } catch (error) {
        console.log(error);

    }
}

export const updateGroupAdmins = (id: number, user: number, is_admin: boolean) => async (dispatch: ThunkDispatch<{}, {}, ChatsActions>) => {
    dispatch({ type: ChatsType.CHATS_LOADING })

    try {
        const { data }: { data: GetGroupMembersPayload } = await apiClient.post(route("group.change.admin"), { id, user, is_admin })
        if (data && data.success) {

            dispatch({ type: ChatsType.CHATS_GET_GROUP_MEMBERS, payload: data })
        }
    } catch (error) {
        console.log(error);

    }
}


export const removeGroupUserAction = (id: number, user: number) => async (dispatch: ThunkDispatch<{}, {}, ChatsActions>) => {
    dispatch({ type: ChatsType.CHATS_LOADING })

    try {
        const { data }: { data: GetGroupMembersPayload } = await apiClient.post(route("group.remove.user"), { id, user })
        if (data && data.success) {

            dispatch({ type: ChatsType.CHATS_GET_GROUP_MEMBERS, payload: data })
        }
    } catch (error) {
        console.log(error);

    }
}

export const clearChatsAction = () => async (dispatch: ThunkDispatch<{}, {}, ChatsActions>) => {
    dispatch({ type: ChatsType.CLEAR_THREADS })
}
export const addOnlineUsersAction = (data: number[]) => async (dispatch: ThunkDispatch<{}, {}, OnlineUsersActions>) => {
    dispatch({ type: OnlineUsersType.ADD_ONLINE_USERS, payload: data })
}

export const removeOfflineUsersAction = (data: number[]) => async (dispatch: ThunkDispatch<{}, {}, OnlineUsersActions>) => {
    dispatch({ type: OnlineUsersType.REMOVE_OFFLINE_USERS, payload: data })
}
