import { useState, useEffect } from "react";
import "./App.css";
import Home from "./pages/Home";
import UserService from "./services/UserService";

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser(UserService.getUser());
    }, []);

    return (
        <div className="App">
            {user && (
                <div className="user-info">
                    <p>Zalogowany jako: <strong>{user.firstName} {user.lastName}</strong></p>
                </div>
            )}
            <Home />
            <footer className="footer">
                Mateusz Dybaś 2025
            </footer>
        </div>
    );
}

export default App;
