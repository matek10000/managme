import React, { useState, useEffect } from "react"
import ProjectService from "../services/ProjectService"
import AuthService from "../services/AuthService"

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
  const [editFields, setEditFields] = useState({})

  const user = AuthService.getUser()
  const isGuest = user?.role === "guest"

  useEffect(() => {
    if (!projectId) return
    async function load() {
      const s = await ProjectService.getStories(projectId)
      setStories(s)
    }
    load()
  }, [projectId])

  const refresh = async () => {
    const s = await ProjectService.getStories(projectId)
    setStories(s)
  }

  const handleAdd = async () => {
    if (isGuest || !newStory.name.trim()) return
    await ProjectService.addStory(projectId, newStory)
    setNewStory({ name: "", description: "", priority: "medium", status: "todo" })
    await refresh()
  }

  const handleUpdate = async (id) => {
    if (isGuest) return
    await ProjectService.updateStory(projectId, id, editFields)
    setEditingId(null)
    await refresh()
  }

  const handleDelete = async (id) => {
    if (isGuest) return
    await ProjectService.deleteStory(projectId, id)
    await refresh()
  }

  const filtered = stories.filter(
    s => filter === "all" || s.status === filter
  )

  return (
    <div className="space-y-6">
      {/* Filtry */}
      <div className="flex gap-2">
        {[
          ["all", "Wszystkie"],
          ["todo", "Do zrobienia"],
          ["doing", "W trakcie"],
          ["done", "Zakończone"],
        ].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-3 py-1 rounded ${
              filter === k
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Dodawanie */}
      {!isGuest && (
        <div className="flex flex-wrap gap-2 bg-gray-100 dark:bg-gray-900 p-4 rounded border border-gray-300 dark:border-gray-600">
          <input
            className="flex-1 px-2 py-1 border rounded"
            placeholder="Nazwa"
            value={newStory.name}
            onChange={e => setNewStory({ ...newStory, name: e.target.value })}
          />
          <input
            className="flex-1 px-2 py-1 border rounded"
            placeholder="Opis"
            value={newStory.description}
            onChange={e => setNewStory({ ...newStory, description: e.target.value })}
          />
          <select
            className="px-2 py-1 border rounded"
            value={newStory.priority}
            onChange={e => setNewStory({ ...newStory, priority: e.target.value })}
          >
            <option value="low">Niski</option>
            <option value="medium">Średni</option>
            <option value="high">Wysoki</option>
          </select>
          <select
            className="px-2 py-1 border rounded"
            value={newStory.status}
            onChange={e => setNewStory({ ...newStory, status: e.target.value })}
          >
            <option value="todo">Do zrobienia</option>
            <option value="doing">W trakcie</option>
            <option value="done">Zakończone</option>
          </select>
          <button
            onClick={handleAdd}
            className="px-4 py-1 bg-green-600 text-white rounded"
          >
            Dodaj
          </button>
        </div>
      )}

      {/* Lista */}
      <ul className="space-y-3">
        {filtered.map(s => (
          <li
            key={s.id}
            className="flex justify-between items-start gap-4 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded"
          >
            <div className="space-y-1 flex-1">
              {editingId === s.id ? (
                <>
                  <input
                    className="w-full px-2 py-1 border rounded"
                    value={editFields.name || s.name}
                    onChange={e =>
                      setEditFields(f => ({ ...f, name: e.target.value }))
                    }
                  />
                  <input
                    className="w-full px-2 py-1 border rounded"
                    value={editFields.description || s.description}
                    onChange={e =>
                      setEditFields(f => ({ ...f, description: e.target.value }))
                    }
                  />
                </>
              ) : (
                <>
                  <h4 className="font-semibold">{s.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {s.description}
                  </p>
                </>
              )}
            </div>
            {!isGuest && (
              <div className="flex flex-col gap-2">
                {editingId === s.id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(s.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Zapisz
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 bg-gray-400 text-white rounded"
                    >
                      Anuluj
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(s.id)
                        setEditFields({ name: s.name, description: s.description })
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded"
                    >
                      Edytuj
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Usuń
                    </button>
                  </>
                )}
              </div>
            )}
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="text-center text-gray-500 dark:text-gray-400">
            Brak historyjek.
          </li>
        )}
      </ul>
    </div>
  )
}
