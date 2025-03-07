import { useState, useEffect } from "react";
import ProjectService from "../services/ProjectService";
import Stories from "../components/Stories";

const Home = () => {
    const [projects, setProjects] = useState([]);
    const [currentProject, setCurrentProject] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        setProjects(ProjectService.getProjects());
        setCurrentProject(ProjectService.getCurrentProject());

        // 🔹 Nasłuchiwanie na zmianę localStorage (np. po zmianie projektu)
        const handleStorageChange = () => {
            setProjects(ProjectService.getProjects());
            setCurrentProject(ProjectService.getCurrentProject());
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const handleSelectProject = (event) => {
        const selectedProjectId = Number(event.target.value);
        const selectedProject = projects.find(p => p.id === selectedProjectId);

        if (selectedProject) {
            ProjectService.setCurrentProject(selectedProject);
            setCurrentProject({ ...selectedProject }); // 🔹 Wymuszenie aktualizacji stanu
            setEditMode(false);
        }
    };

    const handleDeleteProject = () => {
        if (!currentProject) return;

        ProjectService.deleteProject(currentProject.id);
        setProjects(ProjectService.getProjects());
        setCurrentProject(null); // Reset wyboru po usunięciu
        setEditMode(false);
    };

    const handleEditProject = () => {
        if (!currentProject) return;

        const updatedProject = { ...currentProject, name, description };
        ProjectService.updateProject(updatedProject);
        setProjects(ProjectService.getProjects());
        setCurrentProject(updatedProject);
        setEditMode(false);
    };

    return (
        <div>
            <h1>ManagMe - Zarządzanie Projektami</h1>

            {/* 🔹 Dropdown do wyboru projektu */}
            <div className="project-dropdown">
                <label htmlFor="projectSelect">Wybierz projekt:</label>
                <select 
                    id="projectSelect"
                    onChange={handleSelectProject}
                    value={currentProject ? currentProject.id : ""}
                >
                    <option value="" disabled>Wybierz projekt...</option>
                    {projects.map((project) => (
                        <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                </select>
            </div>

            {/* 🔹 Wyświetlanie aktywnego projektu */}
            {currentProject ? (
                <div className="current-project">
                    {editMode ? (
                        <div className="edit-form">
                            <h2>Edytuj projekt</h2>
                            <div className="input-group">
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                />
                            </div>
                            <div className="input-group">
                                <textarea 
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="button-group">
                                <button className="btn-save" onClick={handleEditProject}>Zapisz</button>
                                <button className="btn-cancel" onClick={() => setEditMode(false)}>Anuluj</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h2>{currentProject.name}</h2>
                            <p>{currentProject.description}</p>
                            <div className="button-group">
                                <button className="btn-edit" onClick={() => {
                                    setEditMode(true);
                                    setName(currentProject.name);
                                    setDescription(currentProject.description);
                                }}>Edytuj</button>
                                <button className="btn-delete" onClick={handleDeleteProject}>Usuń</button>
                            </div>
                        </>
                    )}

                    {/* 🔹 Sekcja historyjek */}
                    <Stories />
                </div>
            ) : (
                <p>Wybierz projekt, aby go wyświetlić.</p>
            )}
        </div>
    );
};

export default Home;
