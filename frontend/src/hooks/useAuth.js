import { useState, useCallback } from 'react';
import axios from 'axios';

const TOKEN_KEY = 'froggo_token';
const USER_KEY = 'froggo_user';

export function useAuth() {
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
    const [user, setUser] = useState(() => {
        const u = localStorage.getItem(USER_KEY);
        return u ? JSON.parse(u) : null;
    });

    const saveSession = useCallback((tokenVal, userVal) => {
        localStorage.setItem(TOKEN_KEY, tokenVal);
        localStorage.setItem(USER_KEY, JSON.stringify(userVal));
        setToken(tokenVal);
        setUser(userVal);
        axios.defaults.headers.common['Authorization'] = `Bearer ${tokenVal}`;
    }, []);

    const login = useCallback(async (username, password) => {
        const res = await axios.post('/auth/login', { username, password });
        saveSession(res.data.access_token, res.data.user);
        return res.data;
    }, [saveSession]);

    const register = useCallback(async (username, email, password) => {
        const res = await axios.post('/auth/register', { username, email, password });
        saveSession(res.data.access_token, res.data.user);
        return res.data;
    }, [saveSession]);

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    }, []);

    // Set header on init
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    return { token, user, login, register, logout, isAuthenticated: !!token };
}
