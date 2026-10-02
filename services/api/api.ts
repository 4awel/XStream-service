import axios, { type AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export class ApiError extends Error {
    public readonly status: number;

    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

/** Все запросы идут с cookie — сервер авторизует по сессии. */
export const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' },
});

/** Nest отдаёт ошибки как { message: string | string[] } — приводим к ApiError. */
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ message?: string | string[] }>) => {
        const status = error.response?.status ?? 0;
        const message = error.response?.data?.message;
        const text = Array.isArray(message) ? message.join(', ') : (message ?? error.message);
        return Promise.reject(new ApiError(text, status));
    },
);
