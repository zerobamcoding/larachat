import { User, ValidationErrors } from "@/types"


export interface MessageResponse {
    success: boolean
    errors?: ValidationErrors
    conversation: Direct
}

export interface Direct {
    id: number
    user_one: User
    user_two: User
    messages: Message[] | null
    created_at: Date
    updated_at: Date
}
export interface Message {
    id: number
    type: "text" | "file"
    message: string
    sender: User
    seen: boolean
    replied: number | null
    is_pin: boolean
    created_at: Date
    updated_at: Date
}
