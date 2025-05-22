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

  useEffect(() => {
    if (!projectId) return
    loadAll()
  }, [projectId])

  const loadAll = async () => {
    setTasks(await TaskService.getTasksForProject(projectId))
    setStories(await ProjectService.getStories(projectId))
    setSelectedStory(null)
  }

  const openStories = async () => {
    setStories(await ProjectService.getStories(projectId))
    setShowModal(true)
  }

  const handleAdd = async () => {
    if (isGuest || !selectedStory || !newTask.name.trim()) return
    await TaskService.addTask({
      projectId,
      storyId: selectedStory.id,
      name: newTask.name,
      description: newTask.description,
      priority: newTask.priority,
      estimatedTime: Number(newTask.estimatedTime) || 0,
    })
    setNewTask({ name: "", description: "", priority: "medium", estimatedTime: "" })
    setTasks(await TaskService.getTasksForProject(projectId))
  }

  const changeStatus = async (taskId, newStatus) => {
    if (isGuest) return
    await TaskService.updateTask(projectId, taskId, { status: newStatus })
    setTasks(await TaskService.getTasksForProject(projectId))
  }

  const handleComplete = async (taskId) => {
    if (isGuest) return
    await TaskService.completeTask(projectId, taskId)
    setTasks(await TaskService.getTasksForProject(projectId))
  }

  const handleDelete = async (taskId) => {
    if (isGuest) return
    await TaskService.deleteTask(projectId, taskId)
    setTasks(await TaskService.getTasksForProject(projectId))
  }

  const columns = ["todo", "doing", "done"]
  const nextStatus = { todo: "doing", doing: "done" }
  const prevStatus = { doing: "todo", done: "doing" }

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
          onSelect={story => setSelectedStory(story)}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Formularz dodawania zadania */}
      <div data-cy="task-form" className="space-y-2">
        <input
          data-cy="task-name"
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
                    className="p-3 border rounded flex flex-col gap-2"
                  >
                    <div>
                      <h5 className="font-medium">{task.name}</h5>
                      <p className="text-sm">{task.description}</p>
                      <p className="text-xs">
                        Priorytet: <strong>{task.priority}</strong>
                      </p>
                      <p className="text-xs">
                        Czas: <strong>{task.estimatedTime}h</strong>
                      </p>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      {prevStatus[status] && (
                        <button
                          data-cy="task-prev"
                          onClick={() => changeStatus(task.id, prevStatus[status])}
                          className="text-xl hover:text-gray-700"
                          title={`Przenieś do ${prevStatus[status]}`}
                        >
                          ⏪
                        </button>
                      )}
                      {nextStatus[status] && (
                        <button
                          data-cy="task-next"
                          onClick={() => changeStatus(task.id, nextStatus[status])}
                          className="text-xl hover:text-gray-700"
                          title={`Przenieś do ${nextStatus[status]}`}
                        >
                          ▶️
                        </button>
                      )}
                      <button
                        data-cy="task-delete"
                        onClick={() => handleDelete(task.id)}
                        className="ml-auto px-2 py-1 bg-red-500 text-white text-xs rounded"
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
