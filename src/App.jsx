import { useState, useEffect } from "react";
import "./App.css";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import AuthService from "./services/AuthService";

function App() {
    const [user, setUser] = useState(null);
    const [sessionTime, setSessionTime] = useState(null);

    useEffect(() => {
        const currentUser = AuthService.getUser();
        if (currentUser) {
            setUser(currentUser);
            updateCountdown();
        }

        const interval = setInterval(() => {
            updateCountdown();
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const updateCountdown = () => {
        const msLeft = AuthService.getSessionTimeLeft();
        if (msLeft <= 0) {
            AuthService.logout();
            setUser(null);
            setSessionTime(null);
        } else {
            setSessionTime(msLeft);
        }
    };

    const handleLogin = (user) => {
        setUser(user);
        updateCountdown();
    };

    const handleLogout = () => {
        AuthService.logout();
        setUser(null);
        setSessionTime(null);
    };

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
        <div className="App">
            {user ? (
                <>
                    <div className="user-info">
                        <p>
                            Zalogowany jako: <strong>{user.firstName} {user.lastName}</strong> ({user.role})<br />
                            Sesja wygaśnie za: <strong>{formatTime(sessionTime)}</strong>
                        </p>
                        <button onClick={handleLogout}>Wyloguj</button>
                    </div>
                    <Home />
                    <footer className="footer">Mateusz Dybaś 2025</footer>
                </>
            ) : (
                <LoginPage onLogin={handleLogin} />
            )}
        </div>
    );
}

export default App;
