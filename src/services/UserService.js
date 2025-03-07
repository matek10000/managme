class UserService {
    static getUser() {
        let user = localStorage.getItem('user');

        if (!user) {
            // Mockowany użytkownik
            user = {
                id: 1,
                firstName: "Mateusz",
                lastName: "Dybaś",
                email: "mateusz@microsoft.wsei.edu.pl"
            };
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            user = JSON.parse(user);
        }

        return user;
    }
}

export default UserService;
