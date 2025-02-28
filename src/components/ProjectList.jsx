import ProjectService from "../services/ProjectService";

const ProjectList = ({ projects, onDelete }) => {
    return (
        <div className="project-list">
            {projects.length === 0 ? <p>Brak projektów</p> : (
                projects.map((project) => (
                    <div key={project.id} className="project-card">
                        <h3>{project.name}</h3>
                        <p>{project.description}</p>
                        <button onClick={() => onDelete(project.id)}>Usuń</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default ProjectList;
