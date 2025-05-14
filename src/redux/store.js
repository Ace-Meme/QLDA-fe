import { configureStore } from "@reduxjs/toolkit";
import AuthenticationReducer from "./Authentication";
import signUpReducer from "./SignUpSlice";
const store = configureStore({
    reducer: {
        signUp: signUpReducer,
        authentication: AuthenticationReducer,
    },
});

export default store;
