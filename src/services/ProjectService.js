class ProjectService {
    static getProjects() {
        const projects = localStorage.getItem('projects');

        // Jeśli localStorage jest pusty, dodajemy domyślne projekty
        if (!projects) {
            const defaultProjects = [
                { id: Date.now() + 1, name: "Projekt Alpha", description: "Opis projektu Alpha" },
                { id: Date.now() + 2, name: "Projekt Beta", description: "Opis projektu Beta" },
                { id: Date.now() + 3, name: "Projekt Gamma", description: "Opis projektu Gamma" }
            ];
            localStorage.setItem('projects', JSON.stringify(defaultProjects));
            return defaultProjects;
        }

        return JSON.parse(projects);
    }

    static saveProjects(projects) {
        localStorage.setItem('projects', JSON.stringify(projects));
    }

    static addProject(project) {
        const projects = this.getProjects();
        project.id = Date.now(); // 🔹 Nadajemy dynamiczne ID, żeby nie było konfliktów
        projects.push(project);
        this.saveProjects(projects);
    }

    static deleteProject(id) {
        let projects = this.getProjects();
        projects = projects.filter(project => project.id !== id);
        this.saveProjects(projects);
    }

    static updateProject(updatedProject) {
        let projects = this.getProjects();
        projects = projects.map(project => 
            project.id === updatedProject.id ? updatedProject : project
        );
        this.saveProjects(projects);
    }
}

export default ProjectService;
