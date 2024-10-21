import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlider";

export const rootReducer = combineReducers({
    user: userReducer,
})