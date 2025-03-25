import axios from "axios";

export const API = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

export const signUpUser = async (params) => {
    try {
        const response = await API.post("/register/student", params);
        return response.data;
    } catch (err) {
        console.error(err);
    }
};
