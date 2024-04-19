import { User, ValidationErrors } from "./user"


export interface ThreadsResponse {
    success: boolean;
    threads: Direct[]
    errors?: ValidationErrors
}

export interface SentMessageResponse {
    success: boolean;
    message?: Message
    errors?: ValidationErrors
    from?: string
}

export interface PaginatedMessages {
    success: boolean;
    direct: number
    messages: Message[]
    page: number
    has_more: boolean
}
export interface Direct {
    type: "Direct"
    id: number;
    user_one?: number
    user_two?: number
    userone: User
    usertwo: User
    messages?: Message[]
    unreaded_messages: number
    page: number
    has_more: boolean
    created_at: Date
    updated_at: Date
}
export interface Message {
    id: number
    message: string
    seen: boolean
    pinned: boolean
    sender: number
    messageable_id: number
    messageable: Direct
    files: string | null
    replied?: Message
    type: "text" | "file"
    created_at: Date
    updated_at: Date
}
