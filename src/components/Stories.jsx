import { useState, useEffect } from "react";
import ProjectService from "../services/ProjectService";

const Stories = () => {
    const [stories, setStories] = useState([]);
    const [filter, setFilter] = useState("all");
    const [newStory, setNewStory] = useState({ name: "", description: "", priority: "medium", status: "todo" });
    const [editStory, setEditStory] = useState(null); // 🔹 Przechowuje ID edytowanej historyjki

    useEffect(() => {
        const loadStories = () => {
            const currentProject = ProjectService.getCurrentProject();
            setStories(currentProject?.stories || []);
        };

        loadStories();

        const handleStorageChange = () => {
            loadStories();
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const handleAddStory = () => {
        if (!newStory.name.trim()) return;

        ProjectService.addStory(newStory);
        setNewStory({ name: "", description: "", priority: "medium", status: "todo" });

        const updatedProject = ProjectService.getCurrentProject();
        setStories(updatedProject?.stories || []);
    };

    const handleUpdateStory = (id, updatedFields) => {
        const updatedStory = { ...stories.find(s => s.id === id), ...updatedFields };
        ProjectService.updateStory(updatedStory);

        const updatedProject = ProjectService.getCurrentProject();
        setStories(updatedProject?.stories || []);
        setEditStory(null); // 🔹 Zamknięcie trybu edycji po zapisaniu
    };

    const handleDeleteStory = (id) => {
        ProjectService.deleteStory(id);

        const updatedProject = ProjectService.getCurrentProject();
        setStories(updatedProject?.stories || []);
    };

    const handleEditClick = (story) => {
        setEditStory(story.id);
    };

    const handleCancelEdit = () => {
        setEditStory(null);
    };

    const filteredStories = filter === "all" ? stories : stories.filter(story => story.status === filter);

    return (
        <div className="stories-container">
            <h3>📜 Historyjki</h3>

            {/* 🔹 Filtr */}
            <div className="filter-buttons">
                <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>Wszystkie</button>
                <button className={filter === "todo" ? "active" : ""} onClick={() => setFilter("todo")}>Do zrobienia</button>
                <button className={filter === "doing" ? "active" : ""} onClick={() => setFilter("doing")}>W trakcie</button>
                <button className={filter === "done" ? "active" : ""} onClick={() => setFilter("done")}>Zakończone</button>
            </div>

            {/* 🔹 Formularz dodawania historyjek */}
            <div className="story-form">
                <input
                    type="text"
                    placeholder="Nazwa historyjki"
                    value={newStory.name}
                    onChange={(e) => setNewStory({ ...newStory, name: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Opis historyjki"
                    value={newStory.description}
                    onChange={(e) => setNewStory({ ...newStory, description: e.target.value })}
                />
                <select
                    value={newStory.priority}
                    onChange={(e) => setNewStory({ ...newStory, priority: e.target.value })}
                >
                    <option value="low">Niski</option>
                    <option value="medium">Średni</option>
                    <option value="high">Wysoki</option>
                </select>
                <button className="btn-save" onClick={handleAddStory}>Dodaj</button>
            </div>

            {/* 🔹 Lista historyjek */}
            {filteredStories.length > 0 ? (
                <ul>
                    {filteredStories.map(story => (
                        <li key={story.id} className="story-card">
                            {editStory === story.id ? (
                                // 🔹 Formularz edycji
                                <div className="edit-story">
                                    <input
                                        type="text"
                                        value={story.name}
                                        onChange={(e) => handleUpdateStory(story.id, { name: e.target.value })}
                                    />
                                    <textarea
                                        value={story.description}
                                        onChange={(e) => handleUpdateStory(story.id, { description: e.target.value })}
                                    />
                                    <select
                                        value={story.priority}
                                        onChange={(e) => handleUpdateStory(story.id, { priority: e.target.value })}
                                    >
                                        <option value="low">Niski</option>
                                        <option value="medium">Średni</option>
                                        <option value="high">Wysoki</option>
                                    </select>
                                    <select
                                        value={story.status}
                                        onChange={(e) => handleUpdateStory(story.id, { status: e.target.value })}
                                    >
                                        <option value="todo">Do zrobienia</option>
                                        <option value="doing">W trakcie</option>
                                        <option value="done">Zakończone</option>
                                    </select>
                                    <div className="button-group">
                                        <button className="btn-save" onClick={() => handleUpdateStory(story.id, {})}>Zapisz</button>
                                        <button className="btn-cancel" onClick={handleCancelEdit}>Anuluj</button>
                                    </div>
                                </div>
                            ) : (
                                // 🔹 Widok standardowy historyjki
                                <>
                                    <p><strong>{story.name}</strong></p>
                                    <p>📝 {story.description}</p>
                                    <p>🚀 Priorytet: {story.priority}</p>
                                    <p>📌 Status: {story.status}</p>

                                    {/* 🔹 Zmiana statusu */}
                                    <select value={story.status} onChange={(e) => handleUpdateStory(story.id, { status: e.target.value })}>
                                        <option value="todo">Do zrobienia</option>
                                        <option value="doing">W trakcie</option>
                                        <option value="done">Zakończone</option>
                                    </select>

                                    {/* 🔹 Przyciski */}
                                    <div className="button-group">
                                        <button className="btn-edit" onClick={() => handleEditClick(story)}>Edytuj</button>
                                        <button className="btn-delete" onClick={() => handleDeleteStory(story.id)}>Usuń</button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Brak historyjek w tej kategorii.</p>
            )}
        </div>
    );
};

export default Stories;
