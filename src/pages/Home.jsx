import { useState, useEffect } from "react";
import ProjectService from "../services/ProjectService";
import UserService from "../services/UserService";
import Stories from "../components/Stories";

const Home = () => {
    const [projects, setProjects] = useState([]);
    const [currentProject, setCurrentProject] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [user, setUser] = useState(UserService.getUser());
    const [users, setUsers] = useState(UserService.getUsers());

    useEffect(() => {
        setProjects(ProjectService.getProjects());
        setCurrentProject(ProjectService.getCurrentProject());

        // 🔹 Nasłuchiwanie na zmianę localStorage (np. po zmianie projektu)
        const handleStorageChange = () => {
            setProjects(ProjectService.getProjects());
            setCurrentProject(ProjectService.getCurrentProject());
            setUser(UserService.getUser());
            setUsers(UserService.getUsers());
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const handleSelectProject = (event) => {
        const selectedProjectId = Number(event.target.value);
        const selectedProject = projects.find(p => p.id === selectedProjectId);

        if (selectedProject) {
            ProjectService.setCurrentProject(selectedProject);
            setCurrentProject({ ...selectedProject });
            setEditMode(false);
        }
    };

    const handleDeleteProject = () => {
        if (!currentProject) return;

        ProjectService.deleteProject(currentProject.id);
        setProjects(ProjectService.getProjects());
        setCurrentProject(null);
        setEditMode(false);
    };

    const handleEditProject = () => {
        if (!currentProject) return;
    
        const updatedProject = { 
            ...currentProject, 
            name, 
            description 
        };
    
        // 🔹 Aktualizujemy projekt w localStorage
        ProjectService.updateProject(updatedProject);
    
        // 🔹 Pobieramy najnowszą listę projektów
        const updatedProjects = ProjectService.getProjects();
        setProjects(updatedProjects);
    
        // 🔹 Pobieramy zaktualizowany projekt z listy
        const refreshedProject = updatedProjects.find(p => p.id === updatedProject.id);
        
        if (refreshedProject) {
            setCurrentProject(refreshedProject); // Ustawienie zaktualizowanego projektu
            ProjectService.setCurrentProject(refreshedProject); // Zapisujemy do localStorage
        }
        
        setEditMode(false);
    };
    

    const handleRoleChange = (event) => {
        UserService.updateUserRole(event.target.value);
        setUser(UserService.getUser());
    };

    return (
        <div>
            <h1>ManagMe - Zarządzanie Projektami</h1>

            {/* 🔹 Informacje o użytkowniku */}
            <div className="user-info">
                <p>👤 {user.name} ({user.role})</p>
                <div className="user-role">
                    <label htmlFor="roleSelect">Rola:</label>
                    <select id="roleSelect" value={user.role} onChange={handleRoleChange}>
                        <option value="admin">Admin</option>
                        <option value="devops">DevOps</option>
                        <option value="developer">Developer</option>
                    </select>
                </div>
            </div>

            {/* 🔹 Lista użytkowników */}
            <div className="user-list">
                <h3>👥 Lista użytkowników:</h3>
                <ul>
                    {users.map(u => (
                        <li key={u.id}>
                            {u.name} - <strong>{u.role}</strong>
                        </li>
                    ))}
                </ul>
            </div>

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
