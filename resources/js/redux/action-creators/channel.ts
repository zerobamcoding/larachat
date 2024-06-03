import { ThunkDispatch } from "redux-thunk";
import apiClient from "@/libs/apiClient";
import { MakeNewChannelActions } from "../actions/channel";
import { MakeNewChannel } from "../action-types/channel";
import { MakeNewChannelPayload } from "../types/channel";

export const makeNewChannelAction = (name: string, users: number[]) => async (dispatch: ThunkDispatch<{}, {}, MakeNewChannelActions>) => {
    dispatch({ type: MakeNewChannel.MAKE_NEW_CHANNEL_LOADING })

    try {
        const { data }: { data: MakeNewChannelPayload } = await apiClient.post(route("channel.new"), { name, users })
        if (data && !data.success) {
            dispatch({ type: MakeNewChannel.MAKE_NEW_CHANNEL_ERROR, payload: data })
            return
        }
        dispatch({ type: MakeNewChannel.MAKE_NEW_CHANNEL_SUCCESS, payload: data })
    } catch (error) {
        console.log(error);

    }
}
