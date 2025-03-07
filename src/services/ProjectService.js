class ProjectService {
    static getProjects() {
        const projects = localStorage.getItem("projects");
        return projects ? JSON.parse(projects) : [];
    }

    static saveProjects(projects) {
        localStorage.setItem("projects", JSON.stringify(projects));
        window.dispatchEvent(new Event("storage")); // 🔹 Powiadomienie innych komponentów
    }

    static getCurrentProject() {
        return JSON.parse(localStorage.getItem("currentProject"));
    }

    static setCurrentProject(project) {
        localStorage.setItem("currentProject", JSON.stringify(project));
        window.dispatchEvent(new Event("storage")); // 🔹 Powiadomienie o zmianie projektu
    }

    static addStory(story) {
        let project = this.getCurrentProject();
        if (!project) return;

        if (!project.stories) {
            project.stories = [];
        }

        const newStory = {
            id: Date.now(),
            name: story.name || "Nowa historyjka",
            description: story.description || "",
            priority: story.priority || "medium",
            projectId: project.id,
            createdAt: new Date().toISOString(),
            status: story.status || "todo",
            ownerId: story.ownerId || 1,
        };

        project.stories.push(newStory);

        let projects = this.getProjects();
        projects = projects.map(p => (p.id === project.id ? project : p));
        this.saveProjects(projects);
        this.setCurrentProject(project);
    }

    static updateStory(updatedStory) {
        let project = this.getCurrentProject();
        if (!project || !project.stories) return;

        project.stories = project.stories.map(story =>
            story.id === updatedStory.id ? { ...story, ...updatedStory } : story
        );

        let projects = this.getProjects();
        projects = projects.map(p => (p.id === project.id ? project : p));
        this.saveProjects(projects);
        this.setCurrentProject(project);
    }

    static deleteStory(storyId) {
        let project = this.getCurrentProject();
        if (!project || !project.stories) return;

        project.stories = project.stories.filter(story => story.id !== storyId);

        let projects = this.getProjects();
        projects = projects.map(p => (p.id === project.id ? project : p));
        this.saveProjects(projects);
        this.setCurrentProject(project);
    }
}

export default ProjectService;
