import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: { user: null, accessToken: null },
    reducers: {
        login: (state, action) => {
            return action.payload;
        },
        logout: () => {
            return null;
        },
        updateUser: (state, action) => {
            const currentToken = state.accessToken;
            const updatedUser = action.payload.updatedUser;
            return {
                ...updatedUser,
                accessToken: currentToken
            };
        }
    },
});

export const { login, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
