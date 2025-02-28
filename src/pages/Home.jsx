import { useState, useEffect } from "react";
import ProjectForm from "../components/ProjectForm";
import ProjectList from "../components/ProjectList";
import ProjectService from "../services/ProjectService";

const Home = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        setProjects(ProjectService.getProjects());
    }, []);

    const refreshProjects = () => {
        setProjects(ProjectService.getProjects());
    };

    const handleDelete = (id) => {
        ProjectService.deleteProject(id);
        refreshProjects();
    };

    return (
        <div>
            <h1>ManagMe</h1>
            <h3>Zarządzaj swoimi projektami z jednego miejsca!</h3>
            <ProjectForm onProjectAdded={refreshProjects} />
            <ProjectList 
                projects={projects} 
                onUpdate={refreshProjects} 
                onDelete={handleDelete} 
            />
        </div>
    );
};

export default Home;
