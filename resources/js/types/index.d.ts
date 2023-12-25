export interface ValidationErrors {
    [key: string]: string[]
}

export interface AuthResponse {
    success: boolean;
    token?: string;
    errors?: ValidationErrors;
    expire?: number
}

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at: string;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
