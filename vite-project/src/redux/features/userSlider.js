import { createSlice } from '@reduxjs/toolkit';


const userSlice = createSlice({
    name: 'user',
    initialState: null,
    reducers: {
        login: (state, action) => {
            return action.payload;
        },
        logout: () => {
            return null;
        },
        updateUser: (state, token, action) => {
            const updatedUser = action.payload;
            return updatedUser;
        }
    },
});

export const { login, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
