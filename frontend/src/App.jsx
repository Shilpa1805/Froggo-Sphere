import { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import './index.css';

export default function App() {
    const { isAuthenticated, user, logout } = useAuth();
    const [authed, setAuthed] = useState(isAuthenticated);

    useEffect(() => {
        setAuthed(isAuthenticated);
    }, [isAuthenticated]);

    if (!authed) {
        return <LoginPage onLogin={() => setAuthed(true)} />;
    }

    return <Dashboard user={user} onLogout={() => { logout(); setAuthed(false); }} />;
}
