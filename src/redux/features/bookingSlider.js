import { createSlice } from '@reduxjs/toolkit';

const bookingSlice = createSlice({
    name: 'booking',
    initialState: null,
    reducers: {
        booking: (state, action) => {
            return action.payload;
        },
        bookingReset: () => {
            return null;
        }
    },
});

export const { booking, bookingReset } = bookingSlice.actions;
export default bookingSlice.reducer;
