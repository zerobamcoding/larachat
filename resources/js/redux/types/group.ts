import { Message } from "./chat"
import { User, ValidationErrors } from "./user"


export interface GetGroupMembersPayload {
    success: boolean
    members?: User[]
    id?: number
}
export interface MakeNewGroupPayload {
    success: boolean
    group?: Group
    errors?: ValidationErrors
}

type UserWithPivot = User & { pivot: { is_admin: boolean } }

export interface Group {
    type: "Group"
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
    created_at: Date
    updated_at: Date
}
