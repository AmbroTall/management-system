import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    token: localStorage.getItem("authToken") || null,
    user: null,
    isLoading: false,
    error: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isLoading = false;
        },
        loginFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        // Register actions
        registerStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        registerSuccess: (state, action) => {
            state.isLoading = false;
            state.user = action.payload.user;
        },
        registerFailure: (state, action) => {
            state.isLoading = false;
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null; 
        },

        logout: (state) => {
            state.token = null;
            state.user = null;
            state.isLoading = false;
        },
    },
});

// Selector to check if the user is authenticated
export const selectIsAuthenticated = (state) => !!state.auth.token;
export const selectAuthLoading = (state) => state.auth.isLoading;

export const { loginStart,clearError, loginSuccess, loginFailure, logout, registerStart,
    registerSuccess,
    registerFailure, } = authSlice.actions;
export default authSlice.reducer;
