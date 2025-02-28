class ProjectService {
    static getProjects() {
        const projects = localStorage.getItem('projects');
        return projects ? JSON.parse(projects) : [];
    }

    static saveProjects(projects) {
        localStorage.setItem('projects', JSON.stringify(projects));
    }

    static addProject(project) {
        const projects = this.getProjects();
        project.id = Date.now();
        projects.push(project);
        this.saveProjects(projects);
    }

    static deleteProject(id) {
        let projects = this.getProjects();
        projects = projects.filter(project => project.id !== id);
        this.saveProjects(projects);
    }
}

export default ProjectService;
