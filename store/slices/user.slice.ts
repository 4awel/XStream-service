import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Channel } from '@models/channel';
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

/**
 * Выход. Сессию обязательно гасим на сервере: без этого cookie остаётся рабочей,
 * и «выход» означал бы лишь очистку стора — достаточно обновить страницу,
 * чтобы снова оказаться внутри.
 */
export const logout = createAsyncThunk<void, void, ThunkConfig>('user/logout', async () => {
    await AuthServiceClass.logout();
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        /** Ответы ручек профиля возвращают пользователя целиком — просто подменяем. */
        userUpdated: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        channelUpdated: (state, action: PayloadAction<Channel>) => {
            if (state.user !== null) {
                state.user.channel = action.payload;
            }
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

        // Локально выходим в любом случае: если запрос не прошёл, потому что
        // сессия уже истекла, держать пользователя в сторе тем более незачем.
        [logout.fulfilled, logout.rejected].forEach((matcher) => {
            builder.addCase(matcher, (state) => {
                state.user = null;
                state.isLoading = false;
                state.error = null;
            });
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

export const { resetAuthStep, userUpdated, channelUpdated } = userSlice.actions;
export const userReducer = userSlice.reducer;
