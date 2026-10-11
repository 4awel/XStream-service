import { configureStore } from '@reduxjs/toolkit';
import { channelReducer } from '@store/slices/channel.slice';
import { chatReducer } from '@store/slices/chat.slice';
import { followsReducer } from '@store/slices/follows.slice';
import { userReducer } from '@store/slices/user.slice';

export const makeStore = () =>
    configureStore({
        reducer: {
            user: userReducer,
            channel: channelReducer,
            chat: chatReducer,
            follows: followsReducer,
        },
    });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
