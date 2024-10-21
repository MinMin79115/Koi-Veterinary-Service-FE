import { createSlice } from '@reduxjs/toolkit';

const initialState = JSON.parse(sessionStorage.getItem('userToken')) || null;

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            sessionStorage.setItem('userToken', JSON.stringify(action.payload));
            return action.payload;
        },
        logout: () => {
            sessionStorage.removeItem('userToken');
            return null;
        },
        updateUser: (state, action) => {
            const updatedUser = action.payload;
            sessionStorage.setItem('userToken', JSON.stringify(updatedUser));
            return updatedUser;
        }
    },
});

export const { login, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
