// src/components/Stories.jsx
import React, { useState, useEffect } from "react"
import ProjectService from "../services/ProjectService"

export default function Stories() {
  const [stories, setStories] = useState([])
  const [filter, setFilter] = useState("all")
  const [newStory, setNewStory] = useState({
    name: "",
    description: "",
    priority: "medium",
    status: "todo",
  })
  const [editingId, setEditingId] = useState(null)
  const [editFields, setEditFields] = useState({
    name: "",
    description: "",
    priority: "medium",
    status: "todo",
  })

  // Load on mount and on storage changes
  useEffect(() => {
    const load = () => {
      const proj = ProjectService.getCurrentProject()
      setStories(proj?.stories || [])
    }
    load()
    window.addEventListener("storage", load)
    return () => window.removeEventListener("storage", load)
  }, [])

  // Add new story
  const handleAdd = () => {
    if (!newStory.name.trim()) return
    ProjectService.addStory(newStory)
    const proj = ProjectService.getCurrentProject()
    setStories(proj?.stories || [])
    setNewStory({ name: "", description: "", priority: "medium", status: "todo" })
  }

  // Begin editing
  const startEdit = (story) => {
    setEditingId(story.id)
    setEditFields({
      name: story.name,
      description: story.description,
      priority: story.priority,
      status: story.status,
    })
  }

  // Save edits
  const handleSave = (id) => {
    ProjectService.updateStory({ id, ...editFields })
    const proj = ProjectService.getCurrentProject()
    setStories(proj?.stories || [])
    setEditingId(null)
  }

  // Cancel edit
  const handleCancel = () => {
    setEditingId(null)
  }

  // Delete story
  const handleDelete = (id) => {
    ProjectService.deleteStory(id)
    const proj = ProjectService.getCurrentProject()
    setStories(proj?.stories || [])
  }

  // Filtered list
  const filtered = stories.filter(s => filter === "all" || s.status === filter)

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {[
          ["all", "Wszystkie"],
          ["todo", "Do zrobienia"],
          ["doing", "W trakcie"],
          ["done", "Zakończone"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === key
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Add Story Form */}
      <div className="flex flex-wrap items-end gap-4 bg-gray-100 dark:bg-gray-700 p-4 rounded shadow-sm">
        <input
          type="text"
          value={newStory.name}
          onChange={e => setNewStory({ ...newStory, name: e.target.value })}
          placeholder="Nazwa historyjki"
          className="flex-1 px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          value={newStory.description}
          onChange={e => setNewStory({ ...newStory, description: e.target.value })}
          placeholder="Opis historyjki"
          className="flex-1 px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded focus:ring-2 focus:ring-blue-400"
        />
        <select
          value={newStory.priority}
          onChange={e => setNewStory({ ...newStory, priority: e.target.value })}
          className="px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded focus:ring-2 focus:ring-blue-400"
        >
          <option value="low">Niski</option>
          <option value="medium">Średni</option>
          <option value="high">Wysoki</option>
        </select>
        <select
          value={newStory.status}
          onChange={e => setNewStory({ ...newStory, status: e.target.value })}
          className="px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded focus:ring-2 focus:ring-blue-400"
        >
          <option value="todo">Do zrobienia</option>
          <option value="doing">W trakcie</option>
          <option value="done">Zakończone</option>
        </select>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          Dodaj
        </button>
      </div>

      {/* Story List */}
      <ul className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map(story => (
            <li
              key={story.id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow flex flex-col md:flex-row justify-between gap-4"
            >
              <div className="flex-1 space-y-1">
                {editingId === story.id ? (
                  <>
                    <input
                      type="text"
                      value={editFields.name}
                      onChange={e => setEditFields(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-2 py-1 bg-gray-100 dark:bg-gray-600 border rounded"
                    />
                    <input
                      type="text"
                      value={editFields.description}
                      onChange={e => setEditFields(f => ({ ...f, description: e.target.value }))}
                      className="w-full px-2 py-1 bg-gray-100 dark:bg-gray-600 border rounded"
                    />
                    <div className="flex gap-2">
                      <select
                        value={editFields.priority}
                        onChange={e => setEditFields(f => ({ ...f, priority: e.target.value }))}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-600 border rounded"
                      >
                        <option value="low">Niski</option>
                        <option value="medium">Średni</option>
                        <option value="high">Wysoki</option>
                      </select>
                      <select
                        value={editFields.status}
                        onChange={e => setEditFields(f => ({ ...f, status: e.target.value }))}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-600 border rounded"
                      >
                        <option value="todo">Do zrobienia</option>
                        <option value="doing">W trakcie</option>
                        <option value="done">Zakończone</option>
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="font-semibold">{story.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{story.description}</p>
                    <p className="text-xs">
                      Priorytet: <span className="font-medium">{story.priority}</span>
                    </p>
                    <p className="text-xs">
                      Status: <span className="font-medium">{story.status}</span>
                    </p>
                  </>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {editingId === story.id ? (
                  <>
                    <button
                      onClick={() => handleSave(story.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Zapisz
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-3 py-1 bg-gray-400 dark:bg-gray-600 text-white rounded"
                    >
                      Anuluj
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(story)}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Edytuj
                    </button>
                    <button
                      onClick={() => handleDelete(story.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Usuń
                    </button>
                  </>
                )}
              </div>
            </li>
          ))
        ) : (
          <li className="text-center text-gray-500">Brak historii w tej kategorii.</li>
        )}
      </ul>
    </div>
  )
}
