import axios from "axios";
import store from "./redux/store";
import { logout } from "./redux/authSlice"; // Import logout action

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: "/api", // Replace with your base API URL
    headers: {
        "Content-Type": "multipart/form-data", // Use multipart for file uploads
    },
});

// Request interceptor to add authorization token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = store.getState().auth?.token; // Access token from Redux store
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Unauthorized or Forbidden - token might be invalid or expired
            console.error("Token expired or unauthorized:", error.response);

            // Dispatch logout action to clear Redux state
            store.dispatch(logout());

            // Redirect to login page
            window.location.href = "/login"; // Redirect to login
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
