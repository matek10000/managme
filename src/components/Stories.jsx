import { useState, useEffect } from "react";
import ProjectService from "../services/ProjectService";

const Stories = () => {
    const [stories, setStories] = useState([]);
    const [newStory, setNewStory] = useState({
        name: "",
        description: "",
        priority: "medium",
        status: "todo",
        ownerId: 1,
    });
    const [editingStory, setEditingStory] = useState(null);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        const updateStories = () => {
            const project = ProjectService.getCurrentProject();
            setStories(project?.stories || []);
        };

        updateStories();
        window.addEventListener("storage", updateStories);
        return () => window.removeEventListener("storage", updateStories);
    }, []);

    const addStory = () => {
        if (!newStory.name.trim()) return;
        ProjectService.addStory(newStory);
        setStories([...stories, { ...newStory, id: Date.now(), createdAt: new Date().toISOString() }]);
        setNewStory({ name: "", description: "", priority: "medium", status: "todo", ownerId: 1 });
    };

    const deleteStory = (id) => {
        ProjectService.deleteStory(id);
        setStories(stories.filter(story => story.id !== id));
    };

    const updateStoryStatus = (id, status) => {
        const updatedStories = stories.map(story =>
            story.id === id ? { ...story, status } : story
        );
        setStories(updatedStories);
        ProjectService.updateStory({ id, status });
    };

    const startEditing = (story) => {
        setEditingStory({ ...story });
    };

    const saveEditedStory = () => {
        if (!editingStory.name.trim()) return;
        ProjectService.updateStory(editingStory);
        setStories(stories.map(story => 
            story.id === editingStory.id ? { ...story, ...editingStory } : story
        ));
        setEditingStory(null);
    };

    return (
        <div className="stories-container">
            <h2>Historyjki</h2>

            {/* Formularz dodawania historyjek */}
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
                <button className="btn-save" onClick={addStory}>Dodaj</button>
            </div>

            {/* Filtrowanie */}
            <div className="filter-buttons">
                <button onClick={() => setFilter("all")}>Wszystkie</button>
                <button onClick={() => setFilter("todo")}>Do zrobienia</button>
                <button onClick={() => setFilter("doing")}>W trakcie</button>
                <button onClick={() => setFilter("done")}>Zakończone</button>
            </div>

            {/* Lista historyjek */}
            <div className="story-list">
                {stories.length === 0 ? <p>Brak historyjek</p> : stories.map(story => (
                    <div key={story.id} className="story-card">
                        {editingStory?.id === story.id ? (
                            <>
                                <input 
                                    type="text" 
                                    value={editingStory.name} 
                                    onChange={(e) => setEditingStory({ ...editingStory, name: e.target.value })}
                                />
                                <textarea 
                                    value={editingStory.description}
                                    onChange={(e) => setEditingStory({ ...editingStory, description: e.target.value })}
                                />
                                <select 
                                    value={editingStory.priority} 
                                    onChange={(e) => setEditingStory({ ...editingStory, priority: e.target.value })}
                                >
                                    <option value="low">Niski</option>
                                    <option value="medium">Średni</option>
                                    <option value="high">Wysoki</option>
                                </select>
                                <select 
                                    value={editingStory.status} 
                                    onChange={(e) => setEditingStory({ ...editingStory, status: e.target.value })}
                                >
                                    <option value="todo">Do zrobienia</option>
                                    <option value="doing">W trakcie</option>
                                    <option value="done">Zakończone</option>
                                </select>
                                <div className="button-group">
                                    <button className="btn-save" onClick={saveEditedStory}>Zapisz</button>
                                    <button className="btn-cancel" onClick={() => setEditingStory(null)}>Anuluj</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3>{story.name}</h3>
                                <p>{story.description}</p>
                                <p>🕒 {new Date(story.createdAt).toLocaleDateString()}</p>
                                <p>⚡ Priorytet: {story.priority}</p>
                                <select value={story.status} onChange={(e) => updateStoryStatus(story.id, e.target.value)}>
                                    <option value="todo">Do zrobienia</option>
                                    <option value="doing">W trakcie</option>
                                    <option value="done">Zakończone</option>
                                </select>
                                <div className="button-group">
                                    <button className="btn-edit" onClick={() => startEditing(story)}>Edytuj</button>
                                    <button className="btn-delete" onClick={() => deleteStory(story.id)}>Usuń</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Stories;
