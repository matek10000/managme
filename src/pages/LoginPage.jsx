// src/pages/LoginPage.jsx
import { useState } from "react";
import AuthService from "../services/AuthService";

const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const user = await AuthService.login(username, password);
            onLogin(user);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="login-container">
            <h2>Zaloguj się</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Login"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Zaloguj</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default LoginPage;
