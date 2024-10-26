import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlider";
import bookingReducer from "./bookingSlider";
export const rootReducer = combineReducers({
    user: userReducer,
    booking: bookingReducer,
})