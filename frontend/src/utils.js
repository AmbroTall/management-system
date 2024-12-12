import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds
        return decoded.exp < currentTime; // Check if the token is expired
    } catch (err) {
        console.error("Invalid token", err);
        return true; // Treat invalid tokens as expired
    }
};
