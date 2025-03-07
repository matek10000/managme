import { useState } from "react";
import ProjectService from "../services/ProjectService";

const ProjectList = ({ projects, onUpdate, onDelete, onSelect }) => {
    const [editProject, setEditProject] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const currentProject = ProjectService.getCurrentProject(); // Pobranie aktualnie wybranego projektu

    const handleEditClick = (project) => {
        setEditProject(project);
        setName(project.name);
        setDescription(project.description);
    };

    const handleUpdate = () => {
        if (!editProject) return;

        const updatedProject = { ...editProject, name, description };
        ProjectService.updateProject(updatedProject);
        onUpdate();
        setEditProject(null);
    };

    return (
        <div className="project-list">
            {projects.length === 0 ? <p>Brak projektów</p> : (
                projects.map((project) => {
                    const isActive = currentProject && currentProject.id === project.id;

                    return (
                        <div key={project.id} className={`project-card ${isActive ? "active-project" : ""}`}>
                            {editProject && editProject.id === project.id ? (
                                <div className="edit-form">
                                    <input 
                                        type="text" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)} 
                                    />
                                    <textarea 
                                        value={description} 
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                    <div className="button-group">
                                        <button className="btn-save" onClick={handleUpdate}>Zapisz</button>
                                        <button className="btn-cancel" onClick={() => setEditProject(null)}>Anuluj</button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h3>{project.name}</h3>
                                    <p>{project.description}</p>
                                    <div className="button-group">
                                        <button className="btn-select" onClick={() => onSelect(project)}>Wybierz</button>
                                        {isActive && (
                                            <>
                                                <button className="btn-edit" onClick={() => handleEditClick(project)}>Edytuj</button>
                                                <button className="btn-delete" onClick={() => onDelete(project.id)}>Usuń</button>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
};

export default ProjectList;
