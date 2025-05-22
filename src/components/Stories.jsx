// src/components/Stories.jsx

import React, { useState, useEffect } from "react"
import ProjectService from "../services/ProjectService"

export default function Stories({ projectId }) {
  const [stories, setStories] = useState([])
  const [filter, setFilter] = useState("all")
  const [newStory, setNewStory] = useState({
    name: "",
    description: "",
    priority: "medium",
    status: "todo",
  })
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({ name: "", description: "" })

  useEffect(() => {
    if (!projectId) return
    ;(async () => {
      const list = await ProjectService.getStories(projectId)
      setStories(list)
    })()
  }, [projectId])

  const handleAdd = async () => {
    if (!newStory.name.trim()) return
    await ProjectService.addStory(projectId, newStory)
    const list = await ProjectService.getStories(projectId)
    setStories(list)
    setNewStory({ name: "", description: "", priority: "medium", status: "todo" })
  }

  const handleUpdate = async (id, fields = editValues) => {
    await ProjectService.updateStory(projectId, id, fields)
    const list = await ProjectService.getStories(projectId)
    setStories(list)
    setEditingId(null)
  }

  const handleDelete = async (id) => {
    await ProjectService.deleteStory(projectId, id)
    const list = await ProjectService.getStories(projectId)
    setStories(list)
  }

  const filtered =
    filter === "all" ? stories : stories.filter(s => s.status === filter)

  return (
    <div data-cy="stories">
      {/* tylko formularz i lista, bez nagłówka */}

      {/* Filtr */}
      <div className="flex gap-2 mb-4">
        {[
          { key: "all", label: "Wszystkie" },
          { key: "todo", label: "Do zrobienia" },
          { key: "doing", label: "W trakcie" },
          { key: "done", label: "Zakończone" },
        ].map(({ key, label }) => (
          <button
            key={key}
            data-cy={`filter-${key}`}
            onClick={() => setFilter(key)}
            className={filter === key ? "font-bold" : ""}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Dodawanie */}
      <div data-cy="story-form" className="flex gap-2 mb-6">
        <input
          data-cy="story-name"
          placeholder="Nazwa"
          value={newStory.name}
          onChange={e => setNewStory({ ...newStory, name: e.target.value })}
          className="border p-2 flex-1"
        />
        <input
          data-cy="story-desc"
          placeholder="Opis"
          value={newStory.description}
          onChange={e => setNewStory({ ...newStory, description: e.target.value })}
          className="border p-2 flex-1"
        />
        <select
          data-cy="story-priority"
          value={newStory.priority}
          onChange={e => setNewStory({ ...newStory, priority: e.target.value })}
          className="border p-2"
        >
          <option value="low">Niski</option>
          <option value="medium">Średni</option>
          <option value="high">Wysoki</option>
        </select>
        <button
          data-cy="story-add"
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Dodaj
        </button>
      </div>

      {/* Lista historyjek */}
      <ul data-cy="story-list" className="space-y-4">
        {filtered.length === 0 && <li data-cy="no-stories">Brak historyjek.</li>}
        {filtered.map(story => (
          <li key={story.id} data-cy="story-card" className="border p-4 rounded">
            {editingId === story.id ? (
              <>
                <input
                  data-cy="story-edit-name"
                  value={editValues.name}
                  onChange={e => setEditValues({ ...editValues, name: e.target.value })}
                  className="border p-1 mb-2 w-full"
                />
                <input
                  data-cy="story-edit-desc"
                  value={editValues.description}
                  onChange={e => setEditValues({ ...editValues, description: e.target.value })}
                  className="border p-1 mb-2 w-full"
                />
                <div className="flex gap-2">
                  <button
                    data-cy="story-save"
                    onClick={() => handleUpdate(story.id)}
                    className="bg-green-600 text-white px-3 rounded"
                  >
                    Zapisz
                  </button>
                  <button
                    data-cy="story-cancel"
                    onClick={() => setEditingId(null)}
                    className="bg-gray-400 text-white px-3 rounded"
                  >
                    Anuluj
                  </button>
                </div>
              </>
            ) : (
              <>
                <p><strong>{story.name}</strong></p>
                <p>{story.description}</p>
                <p>Priorytet: {story.priority}</p>
                <select
                  data-cy="story-status"
                  value={story.status}
                  onChange={e => handleUpdate(story.id, { status: e.target.value })}
                  className="border p-1 my-2"
                >
                  <option value="todo">Do zrobienia</option>
                  <option value="doing">W trakcie</option>
                  <option value="done">Zakończone</option>
                </select>
                <div className="flex gap-2 mt-2">
                  <button
                    data-cy="story-edit"
                    onClick={() => {
                      setEditingId(story.id)
                      setEditValues({ name: story.name, description: story.description })
                    }}
                    className="bg-yellow-500 text-white px-3 rounded"
                  >
                    Edytuj
                  </button>
                  <button
                    data-cy="story-delete"
                    onClick={() => handleDelete(story.id)}
                    className="bg-red-600 text-white px-3 rounded"
                  >
                    Usuń
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
