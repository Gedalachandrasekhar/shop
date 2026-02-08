import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem('access') ? localStorage.getItem('access') : null
    );
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Login Function
    const loginUser = async (phone, password) => {
        try {
            const response = await api.post('/users/login/', {
                phone,
                password
            });

            if (response.status === 200) {
                // Save Tokens
                localStorage.setItem('access', response.data.access);
                localStorage.setItem('refresh', response.data.refresh);

                // Set User State
                setUser({
                    phone: response.data.phone,
                    role: response.data.role,
                    name: response.data.full_name
                });

                // --- UPDATED REDIRECT LOGIC ---
                const role = response.data.role;

                if (role === 'ADMIN') {
                    navigate('/admin');
                }
                else if (role === 'MANAGER') {
                    navigate('/manager'); // <--- FIX: Send Manager to their own Dashboard
                }
                else if (role === 'TECHNICIAN' || role === 'EMPLOYEE') {
                    navigate('/technician');
                }
                else {
                    navigate('/customer');
                }
                // -----------------------------

                return { success: true };
            }
        } catch (error) {
            console.error("Login Failed:", error);
            return { success: false, error: error.response?.data?.detail || "Login failed" };
        }
    };

    // Logout Function
    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        navigate('/login');
    };

    // Check if user is logged in on page load
    useEffect(() => {
        const token = localStorage.getItem('access');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                api.get('/users/me/')
                   .then(res => setUser(res.data))
                   .catch(() => logoutUser());
            } catch (e) {
                logoutUser();
            }
        }
        setLoading(false);
    }, []);

    const contextData = {
        user,
        loginUser,
        logoutUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    );
};