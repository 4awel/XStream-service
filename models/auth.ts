export interface Credentials {
    email: string;
    password: string;
}

export interface VerifyPayload {
    email: string;
    code: string;
}

/** RegisterResponse / StatusResponse на сервере. */
export interface StatusResponse {
    status: number;
    message: string;
}
