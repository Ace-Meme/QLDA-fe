import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import * as api from "../api";
// Async Thunk for fetching data
export const fetchUsers = createAsyncThunk(
    "users/fetchUsers", // Action type
    async () => {
        const response = await axios.get("https://jsonplaceholder.typicode.com/users");
        return response.data; // Payload
    },
);

export const signupUser = createAsyncThunk(
    "users/signup",
    async (
        params, // Action type
    ) => {
        const response = await api.signUpUser(params);
        return response.data; // Payload
    },
);

// Slice
const usersSlice = createSlice({
    name: "signUp", // Slice name
    initialState: {
        fullname: "User",
        gender: null,
        email: null,
        phoneNumber: null,
        dob: null,
        userName: null,
        password: null,
    },
    reducers: {
        updateName: (state, action) => {
            state.fullname = action.payload;
        },
        updateGender: (state, action) => {
            state.gender = action.payload;
        },
        updateEmail: (state, action) => {
            state.email = action.payload;
        },
        updatePhone: (state, action) => {
            state.phoneNumber = action.payload;
        },
        updateDob: (state, action) => {
            state.dob = action.payload;
        },
        updateUsername: (state, action) => {
            state.userName = action.payload;
        },
        updatePassword: (state, action) => {
            state.password = action.payload;
        },
    }, // Synchronous reducers (optional)
    extraReducers: (builder) => {
        // Handle async thunk actions
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { updateName, updateGender, updateEmail, updatePhone, updateDob, updatePassword, updateUsername } =
    usersSlice.actions;

export default usersSlice.reducer;
