import { Message } from "./chat"
import { Pivot, UserWithPivot } from "./group"

export interface Channel {
    type: "Channel"
    id: number
    name: string
    description?: string
    creator: number
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
