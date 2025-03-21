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

    const { accessToken, refreshToken, user } = await response.json();

    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const expiresAt = payload.exp * 1000; // ms

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify({ ...user, expiresAt }));

    return { ...user, expiresAt };
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

const getSessionTimeLeft = () => {
    const user = getUser();
    if (!user || !user.expiresAt) return 0;
    return user.expiresAt - Date.now();
};

export default {
    login,
    logout,
    getToken,
    getUser,
    getSessionTimeLeft
};
