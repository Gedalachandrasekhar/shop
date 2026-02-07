import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { jwtDecode } from "jwt-decode"; // You need to install this

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

                // Redirect based on Role
                const role = response.data.role;
                if (role === 'ADMIN') navigate('/admin');
                else if (role === 'MANAGER') navigate('/manager');
                else if (role === 'TECHNICIAN') navigate('/technician');
                else navigate('/customer');

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
            // Ideally, you verify the token with the backend here
            // For now, we assume if it exists, they are logged in.
            // You can decode the token here if you want user details immediately.
            try {
                const decoded = jwtDecode(token);
                // Note: The backend login response gave us the role,
                // but the token payload might not have it unless we customized the token claim.
                // For simplicity, we might fetch the profile:
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