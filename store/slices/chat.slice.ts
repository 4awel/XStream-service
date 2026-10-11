import { createSlice } from '@reduxjs/toolkit';
import { channelChanged } from '@store/slices/channel.slice';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { ChatHistory, ChatMessage } from '@models/realtime';

const MAX_MESSAGES = 200;

interface ChatState {
    messages: ChatMessage[];
    /** Есть ли на сервере сообщения старше первого в списке. */
    hasMore: boolean;
    isLoadingHistory: boolean;
}

const initialState: ChatState = {
    messages: [],
    hasMore: false,
    isLoadingHistory: false,
};

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        messageReceived: (state, action: PayloadAction<ChatMessage>) => {
            // история и сокет могут отдать одно и то же сообщение
            if (state.messages.some((message) => message.id === action.payload.id)) {
                return;
            }
            state.messages.push(action.payload);
            // лимит режет только живой хвост, подгруженную историю не трогаем
            if (state.messages.length > MAX_MESSAGES && !state.hasMore) {
                state.messages.splice(0, state.messages.length - MAX_MESSAGES);
            }
        },
        historyLoading: (state) => {
            state.isLoadingHistory = true;
        },
        historyLoaded: (state, action: PayloadAction<ChatHistory & { channelId: string }>) => {
            state.isLoadingHistory = false;
            state.hasMore = action.payload.hasMore;
            // старые сообщения идут в начало; дубли отбрасываем по id
            const known = new Set(state.messages.map((message) => message.id));
            const older = action.payload.items.filter((message) => !known.has(message.id));
            state.messages.unshift(...older);
        },
        historyFailed: (state) => {
            state.isLoadingHistory = false;
        },
    },
    extraReducers: (builder) => {
        // новый канал — новый чат
        builder.addCase(channelChanged, () => initialState);
    },
});

export const { messageReceived, historyLoading, historyLoaded, historyFailed } = chatSlice.actions;
export const chatReducer = chatSlice.reducer;
