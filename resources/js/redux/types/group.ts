import { User, ValidationErrors } from "./user"


export interface MakeNewGroupPayload {
    success: boolean
    group?: Group
    errors?: ValidationErrors
}

export interface Group {
    id: number
    name: string
    description?: string
    admin: User
    created_at: Date
    updated_at: Date
}
