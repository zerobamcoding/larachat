import { MakeNewChannel } from "../action-types/channel";
import { MakeNewChannelPayload } from "../types/channel";

interface MakeNewChannelLoading {
    type: MakeNewChannel.MAKE_NEW_CHANNEL_LOADING
}

interface MakeNewChannelSuccess {
    type: MakeNewChannel.MAKE_NEW_CHANNEL_SUCCESS
    payload: MakeNewChannelPayload
}

interface MakeNewChannelError {
    type: MakeNewChannel.MAKE_NEW_CHANNEL_ERROR
    payload: MakeNewChannelPayload
}

export type MakeNewChannelActions =
    MakeNewChannelLoading |
    MakeNewChannelSuccess |
    MakeNewChannelError
