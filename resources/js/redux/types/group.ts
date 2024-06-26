import { Message } from "./chat"
import { User, ValidationErrors } from "./user"


export interface RemoveMessagePayload {
    success: boolean
    message?: number
    id?: number
    type?: "Group" | "Direct"
    errors?: ValidationErrors
}

export interface GetGroupMembersPayload {
    success: boolean
    members?: User[]
    id?: number
}

export interface Pivot {
    user_id: number
    group_id: number
    is_admin: boolean
}
export interface MakeNewGroupPayload {
    success: boolean
    group?: Group
    errors?: ValidationErrors
}

export type UserWithPivot = User & { pivot: Pivot }

export interface Group {
    type: "Group"
    id: number
    name: string
    description?: string
    creator: number
    messages?: Message[]
    unreaded_messages: number
    has_more: boolean
    avatar?: string
    members_count: number
    members: UserWithPivot[]
    page: number
    pivot: Pivot
    created_at: Date
    updated_at: Date
    must_join?: boolean
}
