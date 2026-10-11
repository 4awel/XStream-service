import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { UserService } from '@services/user.service';
import { logout } from '@store/slices/user.slice';
import type { PublicChannel } from '@models/channel';

interface FollowsState {
    channels: PublicChannel[];
    isLoaded: boolean;
}

const initialState: FollowsState = {
    channels: [],
    isLoaded: false,
};

export const fetchFollows = createAsyncThunk<PublicChannel[]>('follows/fetch', () =>
    UserService.getFollows(),
);

const followsSlice = createSlice({
    name: 'follows',
    initialState,
    reducers: {
        followsCleared: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFollows.fulfilled, (state, action) => {
                state.channels = action.payload;
                state.isLoaded = true;
            })
            .addCase(fetchFollows.rejected, (state) => {
                state.isLoaded = true;
            })
            .addCase(logout.fulfilled, () => initialState)
            .addCase(logout.rejected, () => initialState);
    },
});

export const { followsCleared } = followsSlice.actions;
export const followsReducer = followsSlice.reducer;
