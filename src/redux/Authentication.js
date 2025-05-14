import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import * as api from "../api";
const storedUser = localStorage.getItem("userInfo");
const parsedUser = storedUser ? JSON.parse(storedUser) : {};
// Async Thunk for fetching data
// export const fetchUsers = createAsyncThunk(
//     "users/fetchUsers", // Action type
//     async () => {
//         const response = await axios.get("https://jsonplaceholder.typicode.com/users");
//         return response.data; // Payload
//     },
// );

// export const signupUser = createAsyncThunk(
//     "users/signup",
//     async (
//         params, // Action type
//     ) => {
//         const response = await api.signUpUser(params);
//         return response.data; // Payload
//     },
// );

// Slice
const authenticationSlice = createSlice({
    name: "authentication", // Slice name
    initialState: {
        fullname: parsedUser.fullname || "User",
        gender: parsedUser.gender || null,
        email: parsedUser.email || null,
        phoneNumber: parsedUser.phoneNumber || null,
        userRole: parsedUser.userRole || null,
    },
    reducers: {
        setUserInformation: (state, action) => {
            const { fullname, gender, email, phoneNumber, userRole } = action.payload;
            state.fullname = fullname;
            state.gender = gender;
            state.email = email;
            state.phoneNumber = phoneNumber;
            state.userRole = userRole;
        },
        logout: (state) => {
            alert("Logout successfully!");
            state.fullname = "User";
            state.gender = null;
            state.email = null;
            state.phoneNumber = null;
            state.userRole = null;
            localStorage.removeItem("userInfo");
        },
    }, // Synchronous reducers (optional)
    // extraReducers: (builder) => {
    //     // Handle async thunk actions
    //     builder
    //         .addCase(fetchUsers.pending, (state) => {
    //             state.loading = true;
    //         })
    //         .addCase(fetchUsers.fulfilled, (state, action) => {
    //             state.loading = false;
    //             state.users = action.payload;
    //         })
    //         .addCase(fetchUsers.rejected, (state, action) => {
    //             state.loading = false;
    //             state.error = action.error.message;
    //         });
    // },
});

export const { setUserInformation, logout } = authenticationSlice.actions;

export default authenticationSlice.reducer;
