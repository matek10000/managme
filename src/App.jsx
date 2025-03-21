import { useState, useEffect } from "react";
import "./App.css";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import AuthService from "./services/AuthService";

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currentUser = AuthService.getUser();
        if (currentUser) setUser(currentUser);
    }, []);

    const handleLogin = (user) => {
        setUser(user);
    };

    const handleLogout = () => {
        AuthService.logout();
        setUser(null);
    };

    return (
        <div className="App">
            {user ? (
                <>
                    <div className="user-info">
                        <p>Zalogowany jako: <strong>{user.login}</strong> ({user.role})</p>
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
