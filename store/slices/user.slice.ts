import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AuthService } from '@services/auth.service';
import { UserService } from '@services/user.service';
import { getErrorMessage } from '@store/utils';
import type { Credentials, VerifyPayload } from '@models/auth';
import type { User } from '@models/user';
import type { UserState } from '@/store/types/user';

// Servises
const AuthServiceClass = new AuthService();

const initialState: UserState = {
    user: null,
    isInitialized: false,
    authStep: 'credentials',
    pendingEmail: null,
    isLoading: false,
    error: null,
};

type ThunkConfig = { rejectValue: string };
export const fetchMe = createAsyncThunk<User | null, void, ThunkConfig>('user/me', async () => {
    try {
        return await UserService.me();
    } catch {
        // 401 — просто нет сессии
        return null;
    }
});

export const registerUser = createAsyncThunk<string, Credentials, ThunkConfig>(
    'user/register',
    async (credentials, { rejectWithValue }) => {
        try {
            await AuthServiceClass.register(credentials);
            return credentials.email;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    },
);

export const verifyEmail = createAsyncThunk<User, VerifyPayload, ThunkConfig>(
    'user/verify',
    async (payload, { rejectWithValue }) => {
        try {
            await AuthServiceClass.verify(payload);
            return await UserService.me();
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    },
);

export const loginUser = createAsyncThunk<User, Credentials, ThunkConfig>(
    'user/login',
    async (credentials, { rejectWithValue }) => {
        try {
            await AuthServiceClass.login(credentials);
            return await UserService.me();
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    },
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // TODO: на сервере нет /auth/logout — сейчас чистится только стор
        logout: (state) => {
            state.user = null;
        },
        resetAuthStep: (state) => {
            state.authStep = 'credentials';
            state.pendingEmail = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isInitialized = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.authStep = 'verify';
                state.pendingEmail = action.payload;
            });

        [verifyEmail, loginUser].forEach((thunk) => {
            builder.addCase(thunk.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
                state.authStep = 'credentials';
                state.pendingEmail = null;
            });
        });

        [registerUser, verifyEmail, loginUser].forEach((thunk) => {
            builder
                .addCase(thunk.pending, (state) => {
                    state.isLoading = true;
                    state.error = null;
                })
                .addCase(thunk.rejected, (state, action) => {
                    state.isLoading = false;
                    state.error = action.payload ?? 'Unknown error';
                });
        });
    },
});

export const { logout, resetAuthStep } = userSlice.actions;
export const userReducer = userSlice.reducer;
