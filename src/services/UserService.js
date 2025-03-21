// src/services/UserService.js

const API_URL = "http://localhost:5001";

class UserService {
    // 🔹 Pobierz wszystkich użytkowników z API
    static async fetchUsers() {
        const response = await fetch(`${API_URL}/users`);
        if (!response.ok) {
            throw new Error("Nie udało się pobrać użytkowników");
        }
        const users = await response.json();
        localStorage.setItem("users", JSON.stringify(users));
        return users;
    }

    static getUsers() {
        const users = localStorage.getItem("users");
        return users ? JSON.parse(users) : [];
    }

    static getUser() {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }

    static setUser(user) {
        localStorage.setItem("user", JSON.stringify(user));
    }

    static updateUserRole(role) {
        let user = this.getUser();
        if (!user) return;
        
        user.role = role;
        this.setUser(user);

        let users = this.getUsers();
        users = users.map(u => (u.id === user.id ? { ...u, role } : u));
        localStorage.setItem("users", JSON.stringify(users));
    }
}

export default UserService;
