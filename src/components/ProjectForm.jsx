import { useState } from "react";
import ProjectService from "../services/ProjectService";

const ProjectForm = ({ onProjectAdded }) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name) return;

        ProjectService.addProject({ name, description });
        onProjectAdded();
        setName("");
        setDescription("");
    };

    return (
        <form onSubmit={handleSubmit} className="project-form">
            <input 
                type="text" 
                placeholder="Nazwa projektu" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
            />
            <textarea 
                placeholder="Opis projektu" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">Dodaj projekt</button>
        </form>
    );
};

export default ProjectForm;
