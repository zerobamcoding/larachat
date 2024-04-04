export interface ValidationErrors {
    [key: string]: string[]
}


export interface User {
    id: number
    name?: string
    description?: string
    avatar?: string
    mobile: number
    username: string
    is_online: boolean
    created_at: Date
    updated_at: Date
}

export interface AuthPayload {
    success: boolean
    user: User | null
    errors?: ValidationErrors
}

export interface ThreadsList {
    success: boolean
    users: User[] | null
    errors?: ValidationErrors
}
