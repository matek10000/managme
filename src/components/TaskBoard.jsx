import React, { useState, useEffect } from "react"
import TaskService from "../services/TaskService"
import AuthService from "../services/AuthService"

export default function TaskBoard({ projectId }) {
  const [tasks, setTasks] = useState([])

  const user = AuthService.getUser()
  const isGuest = user?.role === "guest"

  useEffect(() => {
    if (!projectId) return
    async function load() {
      const t = await TaskService.getTasksForProject(projectId)
      setTasks(t)
    }
    load()
  }, [projectId])

  const refresh = async () => {
    const t = await TaskService.getTasksForProject(projectId)
    setTasks(t)
  }

  const handleComplete = async (id) => {
    if (isGuest) return
    await TaskService.updateTask(id, { status: "done", endDate: Date.now() })
    await refresh()
  }

  const handleDelete = async (id) => {
    if (isGuest) return
    await TaskService.deleteTask(id)
    await refresh()
  }

  const columns = ["todo", "doing", "done"]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(status => (
          <div
            key={status}
            className="bg-white dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700 shadow"
          >
            <h4 className="font-semibold mb-3 uppercase">{status}</h4>
            <div className="space-y-4">
              {tasks.filter(t => t.status === status).length === 0 && (
                <p className="text-gray-500 dark:text-gray-400">Brak zadań.</p>
              )}
              {tasks
                .filter(t => t.status === status)
                .map(task => (
                  <div
                    key={task.id}
                    className="p-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded"
                  >
                    <h5 className="font-medium">{task.name}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {task.description}
                    </p>
                    <p className="mt-1 text-xs">
                      Priorytet:{" "}
                      <span className="font-medium">{task.priority}</span>
                    </p>
                    <p className="mt-1 text-xs">
                      Czas:{" "}
                      <span className="font-medium">
                        {task.estimatedTime}h
                      </span>
                    </p>
                    <div className="mt-2 flex gap-2">
                      {status === "doing" && (
                        <button
                          onClick={() => handleComplete(task.id)}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded"
                        >
                          Zakończ
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded"
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
