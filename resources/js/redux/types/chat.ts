import { Group } from "./group";
import { User, ValidationErrors } from "./user"


export interface ChatJoinPayload {
    success: boolean;
    thread: Direct | Group | User
    errors?: ValidationErrors
}

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
    id: number
    model: string
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
    must_join?: boolean
}
export interface Message {
    id: number
    message: string
    is_seen: boolean
    pinned: boolean
    sender: User
    messageable_id: number
    messageable_type: string
    messageable: Direct
    files: string | null
    seens_count: number
    replied?: Message
    type: "text" | "file"
    created_at: Date
    updated_at: Date
}
