import React, { useState, useEffect } from "react"
import ProjectService from "../services/ProjectService"
import AuthService from "../services/AuthService"

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

  const user = AuthService.getUser()
  const isGuest = user?.role === "guest"

  useEffect(() => {
    const load = () => {
      const proj = ProjectService.getCurrentProject()
      setStories(proj?.stories || [])
    }
    load()
    window.addEventListener("storage", load)
    return () => window.removeEventListener("storage", load)
  }, [])

  const handleAdd = () => {
    if (isGuest || !newStory.name.trim()) return
    ProjectService.addStory(newStory)
    const proj = ProjectService.getCurrentProject()
    setStories(proj?.stories || [])
    setNewStory({ name: "", description: "", priority: "medium", status: "todo" })
  }

  const startEdit = (s) => {
    if (isGuest) return
    setEditingId(s.id)
    setEditFields({
      name: s.name,
      description: s.description,
      priority: s.priority,
      status: s.status,
    })
  }

  const handleSave = (id) => {
    if (isGuest) return
    ProjectService.updateStory({ id, ...editFields })
    const proj = ProjectService.getCurrentProject()
    setStories(proj?.stories || [])
    setEditingId(null)
  }

  const handleDelete = (id) => {
    if (isGuest) return
    ProjectService.deleteStory(id)
    const proj = ProjectService.getCurrentProject()
    setStories(proj?.stories || [])
  }

  const filtered = stories.filter((s) => filter === "all" || s.status === filter)

  return (
    <div className="space-y-4">
      {/* Filtry */}
      <div className="flex flex-wrap gap-2">
        {[
          ["all", "Wszystkie"],
          ["todo", "Do zrobienia"],
          ["doing", "W trakcie"],
          ["done", "Zakończone"],
        ].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-3 py-1 rounded-full text-sm ${
              filter === k
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      {/* Dodawanie */}
      {!isGuest && (
        <div className="flex flex-wrap items-end gap-4 bg-gray-100 dark:bg-gray-900 p-4 rounded shadow border border-gray-300 dark:border-gray-600">
          <input
            type="text"
            value={newStory.name}
            onChange={(e) => setNewStory({ ...newStory, name: e.target.value })}
            placeholder="Nazwa historyjki"
            className="flex-1 px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none"
          />
          <input
            type="text"
            value={newStory.description}
            onChange={(e) =>
              setNewStory({ ...newStory, description: e.target.value })
            }
            placeholder="Opis historyjki"
            className="flex-1 px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none"
          />
          <select
            value={newStory.priority}
            onChange={(e) => setNewStory({ ...newStory, priority: e.target.value })}
            className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
          >
            <option value="low">Niski</option>
            <option value="medium">Średni</option>
            <option value="high">Wysoki</option>
          </select>
          <select
            value={newStory.status}
            onChange={(e) => setNewStory({ ...newStory, status: e.target.value })}
            className="px-2 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded"
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
      )}

      {/* Lista */}
      <ul className="space-y-3">
        {filtered.map((s) => (
          <li
            key={s.id}
            className="bg-white dark:bg-gray-900 p-4 rounded shadow border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between gap-4"
          >
            <div className="flex-1 space-y-1">
              {editingId === s.id ? (
                <>
                  <input
                    value={editFields.name}
                    onChange={(e) =>
                      setEditFields((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full px-2 py-1 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded"
                  />
                  <input
                    value={editFields.description}
                    onChange={(e) =>
                      setEditFields((f) => ({ ...f, description: e.target.value }))
                    }
                    className="w-full px-2 py-1 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded"
                  />
                  <div className="flex gap-2">
                    <select
                      value={editFields.priority}
                      onChange={(e) =>
                        setEditFields((f) => ({ ...f, priority: e.target.value }))
                      }
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded"
                    >
                      <option value="low">Niski</option>
                      <option value="medium">Średni</option>
                      <option value="high">Wysoki</option>
                    </select>
                    <select
                      value={editFields.status}
                      onChange={(e) =>
                        setEditFields((f) => ({ ...f, status: e.target.value }))
                      }
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded"
                    >
                      <option value="todo">Do zrobienia</option>
                      <option value="doing">W trakcie</option>
                      <option value="done">Zakończone</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <h4 className="font-semibold">{s.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {s.description}
                  </p>
                  <p className="text-xs">
                    Priorytet: <span className="font-medium">{s.priority}</span>
                  </p>
                  <p className="text-xs">
                    Status: <span className="font-medium">{s.status}</span>
                  </p>
                </>
              )}
            </div>
            {!isGuest && (
              <div className="flex flex-col gap-2">
                {editingId === s.id ? (
                  <>
                    <button
                      onClick={() => handleSave(s.id)}
                      className="px-3 py-1 bg-green-600 text-white rounded"
                    >
                      Zapisz
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 bg-gray-400 dark:bg-gray-600 text-white rounded"
                    >
                      Anuluj
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(s)}
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
            Brak historii.
          </li>
        )}
      </ul>
    </div>
  )
}
