// src/components/TaskBoard.jsx

import React, { useState, useEffect } from "react"
import TaskService from "../services/TaskService"
import ProjectService from "../services/ProjectService"
import AuthService from "../services/AuthService"
import StoriesModal from "./StoriesModal"

export default function TaskBoard({ projectId }) {
  const [tasks, setTasks] = useState([])
  const [stories, setStories] = useState([])
  const [selectedStory, setSelectedStory] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    priority: "medium",
    estimatedTime: "",
  })

  const user = AuthService.getUser()
  const isGuest = user?.role === "guest"

  // załaduj zadania przy zmianie projectId
  useEffect(() => {
    if (!projectId) return
    refreshTasks()
    setSelectedStory(null)
  }, [projectId])

  // helper do odświeżania zadań
  const refreshTasks = async () => {
    const t = await TaskService.getTasksForProject(projectId)
    setTasks(t)
  }

  // helper do odświeżania historyjek
  const refreshStories = async () => {
    const s = await ProjectService.getStories(projectId)
    setStories(s)
  }

  // obsługa otwarcia modalu: odśwież historie + pokaż modal
  const openStories = async () => {
    await refreshStories()
    setShowModal(true)
  }

  const handleAdd = async () => {
    if (isGuest || !selectedStory || !newTask.name.trim()) return
    await TaskService.addTask({
      ...newTask,
      projectId,
      storyId: selectedStory.id,
      estimatedTime: Number(newTask.estimatedTime) || 0,
    })
    setNewTask({ name: "", description: "", priority: "medium", estimatedTime: "" })
    await refreshTasks()
  }

  const handleComplete = async (id) => {
    if (isGuest) return
    await TaskService.completeTask(id)
    await refreshTasks()
  }

  const handleDelete = async (id) => {
    if (isGuest) return
    await TaskService.deleteTask(id)
    await refreshTasks()
  }

  const columns = ["todo", "doing", "done"]

  return (
    <div data-cy="task-board" className="space-y-6">
      {/* Wybór historyjki */}
      <div className="mb-4">
        <button
          data-cy="open-stories-modal"
          onClick={openStories}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          {selectedStory ? `Story: ${selectedStory.name}` : "Wybierz historyjkę"}
        </button>
      </div>

      {showModal && (
        <StoriesModal
          stories={stories}
          onSelect={story => {
            setSelectedStory(story)
          }}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Formularz dodawania zadania */}
      <div data-cy="task-form" className="space-y-2">
        <input
          data-cy="task-name"
          type="text"
          placeholder="Nazwa zadania"
          value={newTask.name}
          onChange={e => setNewTask({ ...newTask, name: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <textarea
          data-cy="task-desc"
          placeholder="Opis zadania"
          value={newTask.description}
          onChange={e => setNewTask({ ...newTask, description: e.target.value })}
          className="w-full border p-2 rounded"
        />
        <div className="flex gap-2">
          <input
            data-cy="task-time"
            type="number"
            placeholder="Szacowany czas (h)"
            value={newTask.estimatedTime}
            onChange={e => setNewTask({ ...newTask, estimatedTime: e.target.value })}
            className="border p-2 rounded flex-1"
          />
          <select
            data-cy="task-priority"
            value={newTask.priority}
            onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="low">Niski</option>
            <option value="medium">Średni</option>
            <option value="high">Wysoki</option>
          </select>
        </div>
        <button
          data-cy="task-add"
          onClick={handleAdd}
          disabled={isGuest || !selectedStory}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Dodaj zadanie
        </button>
      </div>

      {/* Kolumny zadań */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(status => (
          <div
            key={status}
            data-cy={`column-${status}`}
            className="p-4 bg-white dark:bg-gray-800 rounded border"
          >
            <h4 className="font-semibold mb-3 uppercase">{status}</h4>
            <div className="space-y-4">
              {tasks.filter(t => t.status === status && t.storyId === selectedStory?.id)
                .length === 0 && (
                <p className="text-gray-500 dark:text-gray-400">Brak zadań.</p>
              )}
              {tasks
                .filter(t => t.status === status && t.storyId === selectedStory?.id)
                .map(task => (
                  <div
                    key={task.id}
                    data-cy="task-card"
                    className="p-3 border rounded"
                  >
                    <h5 className="font-medium">{task.name}</h5>
                    <p className="text-sm">{task.description}</p>
                    <p className="text-xs">
                      Priorytet: <strong>{task.priority}</strong>
                    </p>
                    <p className="text-xs">
                      Czas: <strong>{task.estimatedTime}h</strong>
                    </p>
                    <div className="mt-2 flex gap-2">
                      {status === "doing" && (
                        <button
                          data-cy="task-complete"
                          onClick={() => handleComplete(task.id)}
                          className="px-3 py-1 bg-blue-500 text-white text-xs rounded"
                        >
                          Zakończ
                        </button>
                      )}
                      <button
                        data-cy="task-delete"
                        onClick={() => handleDelete(task.id)}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded"
                      >
                        Usuń
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
