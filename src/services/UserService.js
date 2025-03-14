class UserService {
    static getUsers() {
        const users = localStorage.getItem("users");
        if (users) return JSON.parse(users);

        // 🔹 Mock użytkowników jeśli nie ma ich w localStorage
        const defaultUsers = [
            { id: 1, name: "Mateusz Dybaś", role: "admin" },
            { id: 2, name: "Kamil Nowak", role: "developer" },
            { id: 3, name: "Agnieszka Kowalska", role: "devops" }
        ];

        localStorage.setItem("users", JSON.stringify(defaultUsers));
        return defaultUsers;
    }

    static getUser() {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : { id: 1, name: "Mateusz Dybaś", role: "admin" };
    }

    static setUser(user) {
        localStorage.setItem("user", JSON.stringify(user));
    }

    static updateUserRole(role) {
        let user = this.getUser();
        user.role = role;
        this.setUser(user);

        let users = this.getUsers();
        users = users.map(u => (u.id === user.id ? { ...u, role } : u));
        localStorage.setItem("users", JSON.stringify(users));
    }
}

export default UserService;
