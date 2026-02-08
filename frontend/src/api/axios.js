import axios from 'axios';

// Create base instance
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api', // Ensure this matches your Django URL
});

// --- INTERCEPTOR: Attach Token to Every Request ---
api.interceptors.request.use(
    (config) => {
        // 1. Get token from Local Storage
        const token = localStorage.getItem('access');

        // 2. If token exists, attach it to headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;