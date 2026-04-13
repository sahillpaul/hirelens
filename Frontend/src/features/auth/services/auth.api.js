import axios from "axios";

const api = axios.create({
    // This tells Vite: "Use the live link in Vercel, but use localhost on my laptop"
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
    withCredentials: true,
});

// FIX 1: Removed {} from parameters
export async function register(username, email, password) {
    try {
        const response = await api.post('/api/auth/register', {
            username, email, password
        });
        return response.data;
    } catch (err) {
        console.log(err);
        throw err; // FIX 2: Throw error so the Hook Layer can catch it
    }
}

// FIX 1: Removed {} from parameters
export async function login(email, password) {
    try {
        const response = await api.post("/api/auth/login", {
            email, password
        });
        return response.data;
    } catch (err) {
        console.log(err);
        throw err; // FIX 2: Throw error so the Hook Layer can catch it
    }
}

export async function logout() {
    try {
        const response = await api.get("/api/auth/logout");
        return response.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function getMe() {
    try {
        const response = await api.get("/api/auth/get-me");
        return response.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}