import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { FollowEvent, SubscriptionEvent, ViewersCountEvent } from '@models/realtime';

const MAX_ALERTS = 20;

export type ChannelAlert =
    { type: 'follow'; data: FollowEvent } | { type: 'subscription'; data: SubscriptionEvent };

/** Live-состояние канала, который сейчас открыт. */
interface ChannelState {
    currentChannelId: string | null;
    viewersCount: number;
    followersCount: number;
    alerts: ChannelAlert[];
}

const initialState: ChannelState = {
    currentChannelId: null,
    viewersCount: 0,
    followersCount: 0,
    alerts: [],
};

const pushAlert = (state: ChannelState, alert: ChannelAlert): void => {
    state.alerts.unshift(alert);
    state.alerts.splice(MAX_ALERTS);
};

const channelSlice = createSlice({
    name: 'channel',
    initialState,
    reducers: {
        channelChanged: (_state, action: PayloadAction<string>) => ({
            ...initialState,
            currentChannelId: action.payload,
        }),
        viewersUpdated: (state, action: PayloadAction<ViewersCountEvent>) => {
            if (action.payload.channelId === state.currentChannelId) {
                state.viewersCount = action.payload.count;
            }
        },
        followReceived: (state, action: PayloadAction<FollowEvent>) => {
            if (action.payload.channelId === state.currentChannelId) {
                state.followersCount = action.payload.followersCount;
                pushAlert(state, { type: 'follow', data: action.payload });
            }
        },
        subscriptionReceived: (state, action: PayloadAction<SubscriptionEvent>) => {
            if (action.payload.channelId === state.currentChannelId) {
                pushAlert(state, { type: 'subscription', data: action.payload });
            }
        },
    },
});

export const { channelChanged, viewersUpdated, followReceived, subscriptionReceived } =
    channelSlice.actions;
export const channelReducer = channelSlice.reducer;
