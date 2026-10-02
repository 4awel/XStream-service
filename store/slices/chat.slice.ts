import { createSlice } from '@reduxjs/toolkit';
import { channelChanged } from '@store/slices/channel.slice';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ChatMessage } from '@models/realtime';

const MAX_MESSAGES = 200;

interface ChatState {
    messages: ChatMessage[];
}

const initialState: ChatState = {
    messages: [],
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        messageReceived: (state, action: PayloadAction<ChatMessage>) => {
            state.messages.push(action.payload);
            if (state.messages.length > MAX_MESSAGES) {
                state.messages.splice(0, state.messages.length - MAX_MESSAGES);
            }
        },
    },
    extraReducers: (builder) => {
        // новый канал — новый чат
        builder.addCase(channelChanged, (state) => {
            state.messages = [];
        });
    },
});

export const { messageReceived } = chatSlice.actions;
export const chatReducer = chatSlice.reducer;
