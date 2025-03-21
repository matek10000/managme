require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;
let refreshTokens = [];

const USERS_FILE = path.join(__dirname, "users.json");

const getUsers = () => {
    const usersData = fs.readFileSync(USERS_FILE);
    return JSON.parse(usersData);
};

app.get("/users", (req, res) => {
    const users = getUsers().map(({ password, ...rest }) => rest);
    res.json(users);
});

app.post("/login", (req, res) => {
    const { login, password } = req.body;
    const users = getUsers();

    const user = users.find(u => u.login === login);
    if (!user || user.password !== password) {
        return res.status(401).json({ error: "Nieprawidłowe dane logowania!" });
    }

    const accessToken = jwt.sign(
        { id: user.id, role: user.role, login: user.login },
        JWT_SECRET,
        { expiresIn: "10m" }
    );

    const refreshToken = jwt.sign(
        { id: user.id },
        REFRESH_SECRET,
        { expiresIn: "30m" }
    );

    refreshTokens.push(refreshToken);

    res.json({
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            login: user.login,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        },
    });    
});

app.post("/refresh", (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken || !refreshTokens.includes(refreshToken)) {
        return res.status(403).json({ error: "Brak dostępu!" });
    }

    jwt.verify(refreshToken, REFRESH_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Nieprawidłowy token!" });

        const newAccessToken = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: "15m" }
        );

        res.json({ accessToken: newAccessToken });
    });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`✅ API działa na http://localhost:${PORT}`));
