require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || "tajny_klucz";
const REFRESH_SECRET = process.env.REFRESH_SECRET || "tajny_refresh_klucz";
let refreshTokens = [];

const USERS_FILE = path.join(__dirname, "users.json");

const getUsers = () => {
    const usersData = fs.readFileSync(USERS_FILE);
    return JSON.parse(usersData);
};

// 🔹 Logowanie
app.post("/login", (req, res) => {
    const { login, password } = req.body;
    const users = getUsers();

    const user = users.find(u => u.login === login);
    if (!user || user.password !== password) {
        return res.status(401).json({ error: "Nieprawidłowe dane logowania!" });
    }

    const accessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: "7d" });

    refreshTokens.push(refreshToken);

    res.json({
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            login: user.login,
            role: user.role,
        },
    });
});

// 🔄 Odświeżanie tokenu
app.post("/refresh", (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken || !refreshTokens.includes(refreshToken)) {
        return res.status(403).json({ error: "Brak dostępu!" });
    }

    jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Nieprawidłowy token!" });

        const newAccessToken = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "15m" });
        res.json({ accessToken: newAccessToken });
    });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ API działa na http://localhost:${PORT}`));
