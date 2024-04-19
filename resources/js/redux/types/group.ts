import { Message } from "./chat"
import { User, ValidationErrors } from "./user"


export interface MakeNewGroupPayload {
    success: boolean
    group?: Group
    errors?: ValidationErrors
}

export interface Group {
    type: "Group"
    id: number
    name: string
    description?: string
    creator: User
    messages?: Message[]
    unreaded_messages: number
    has_more: boolean
    page: number
    created_at: Date
    updated_at: Date
}
