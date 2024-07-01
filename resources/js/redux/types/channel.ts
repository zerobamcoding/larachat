import { Message } from "./chat"
import { Pivot, UserWithPivot } from "./group"
import { User, ValidationErrors } from "./user"

export interface GetChannelMembersPayload {
    success: boolean
    members?: User[]
    id?: number
}

export interface MakeNewChannelPayload {
    success: boolean
    channel?: Channel
    errors?: ValidationErrors
}


export interface Channel {
    type: "Channel"
    id: number
    name: string
    description?: string
    creator: number
    avatar?: string
    messages?: Message[]
    unreaded_messages: number
    has_more: boolean
    members_count: number
    members: UserWithPivot[]
    page: number
    pivot: Pivot
    created_at: Date
    updated_at: Date
    must_join?: boolean
}
