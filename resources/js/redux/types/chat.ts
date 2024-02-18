import { User, ValidationErrors } from "@/types"


export interface SentMessageResponse {
    success: boolean;
    thread: Direct
    errors?: ValidationErrors
}
export interface Direct {
    id: number;
    user_one: User
    user_two: User
    messages?: Message[]
    created_at: Date
    updated_at: Date
}
export interface Message {
    id: number
    message: string
    seen: boolean
    pinned: boolean
    sender: User
    replied?: number
    type: "text" | "file"
    created_at: Date
    updated_at: Date
}
