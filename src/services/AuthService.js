const API_URL = "http://localhost:5001";

const login = async (login, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
    });

    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Błąd logowania");
    }

    const { accessToken, refreshToken } = await response.json();

    // Od teraz user to obiekt, który sami tworzymy z danych zakodowanych w tokenie
    const userPayload = JSON.parse(atob(accessToken.split('.')[1])); // dekodujemy JWT
    const user = {
        id: userPayload.id,
        role: userPayload.role,
        login: login
    };

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));

    return user;
};

const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
};

const getToken = () => localStorage.getItem("accessToken");

const getUser = () => {
    const userData = localStorage.getItem("user");
    try {
        return userData ? JSON.parse(userData) : null;
    } catch (err) {
        console.error("Błąd parsowania usera:", err);
        return null;
    }
};

export default {
    login,
    logout,
    getToken,
    getUser,
};
