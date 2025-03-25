import { configureStore } from "@reduxjs/toolkit";
import signUpReducer from "./SignUpSlice";

const store = configureStore({
    reducer: {
        signUp: signUpReducer,
    },
});

export default store;
