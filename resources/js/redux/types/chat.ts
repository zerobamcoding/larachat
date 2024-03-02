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
}
export interface Direct {
    id: number;
    user_one?: number
    user_two?: number
    userone: User
    usertwo: User
    messages?: Message[]
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
    replied?: number
    type: "text" | "file"
    created_at: Date
    updated_at: Date
}
