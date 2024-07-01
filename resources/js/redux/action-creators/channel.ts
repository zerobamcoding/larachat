import { ThunkDispatch } from "redux-thunk";
import apiClient from "@/libs/apiClient";
import { MakeNewChannelActions } from "../actions/channel";
import { MakeNewChannel } from "../action-types/channel";
import { GetChannelMembersPayload, MakeNewChannelPayload } from "../types/channel";
import { ChatsType } from "../action-types/chat";
import { ChatsActions } from "../actions/chat";

export const makeNewChannelAction = (formData: FormData) => async (dispatch: ThunkDispatch<{}, {}, MakeNewChannelActions>) => {
    dispatch({ type: MakeNewChannel.MAKE_NEW_CHANNEL_LOADING })

    try {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }
        const { data }: { data: MakeNewChannelPayload } = await apiClient.post(route("channel.new"), formData, config)
        if (data && !data.success) {
            dispatch({ type: MakeNewChannel.MAKE_NEW_CHANNEL_ERROR, payload: data })
            return
        }
        dispatch({ type: MakeNewChannel.MAKE_NEW_CHANNEL_SUCCESS, payload: data })
    } catch (error) {
        console.log(error);

    }
}


export const getChannelMembersAction = (id: number) => async (dispatch: ThunkDispatch<{}, {}, ChatsActions>) => {
    dispatch({ type: ChatsType.CHATS_LOADING })

    try {
        const { data }: { data: GetChannelMembersPayload } = await apiClient.get(route("channel.members", { id }))
        if (data && data.success) {

            dispatch({ type: ChatsType.CHATS_GET_CHANNEL_MEMBERS, payload: data })
        }
    } catch (error) {
        console.log(error);

    }
}

export const updateChannelAdmins = (id: number, user: number, is_admin: boolean) => async (dispatch: ThunkDispatch<{}, {}, ChatsActions>) => {
    dispatch({ type: ChatsType.CHATS_LOADING })

    try {
        const { data }: { data: GetChannelMembersPayload } = await apiClient.post(route("channel.change.admin"), { id, user, is_admin })
        if (data && data.success) {

            dispatch({ type: ChatsType.CHATS_GET_CHANNEL_MEMBERS, payload: data })
        }
    } catch (error) {
        console.log(error);

    }
}


export const removeChannelUserAction = (id: number, user: number) => async (dispatch: ThunkDispatch<{}, {}, ChatsActions>) => {
    dispatch({ type: ChatsType.CHATS_LOADING })

    try {
        const { data }: { data: GetChannelMembersPayload } = await apiClient.post(route("channel.remove.user"), { id, user })
        if (data && data.success) {

            dispatch({ type: ChatsType.CHATS_GET_CHANNEL_MEMBERS, payload: data })
        }
    } catch (error) {
        console.log(error);

    }
}
