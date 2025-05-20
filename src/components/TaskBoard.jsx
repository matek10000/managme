import React, { useState, useEffect } from "react"
import TaskService from "../services/TaskService"
import UserService from "../services/UserService"

export default function TaskBoard({ projectId }) {
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    setTasks(TaskService.getTasksForProject(projectId))
    UserService.fetchUsers().then(u => setUsers(u))

    const onStorage = () => {
      setTasks(TaskService.getTasksForProject(projectId))
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [projectId])

  const assign = (taskId, userId) => {
    TaskService.assignUser(taskId, userId)
    setTasks(TaskService.getTasksForProject(projectId))
  }
  const complete = id => {
    TaskService.completeTask(id)
    setTasks(TaskService.getTasksForProject(projectId))
  }
  const remove = id => {
    TaskService.deleteTask(id)
    setTasks(TaskService.getTasksForProject(projectId))
  }

  const columns = [
    { key: "todo", title: "To Do" },
    { key: "doing", title: "In Progress" },
    { key: "done", title: "Done" },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(col => (
          <div key={col.key} className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h4 className="font-semibold mb-3">{col.title}</h4>
            <div className="space-y-4">
              {tasks.filter(t => t.status === col.key).length === 0 && (
                <p className="text-gray-500 dark:text-gray-400">Brak zadań.</p>
              )}
              {tasks
                .filter(t => t.status === col.key)
                .map(task => (
                  <div key={task.id} className="border border-gray-200 dark:border-gray-700 p-3 rounded">
                    <h5 className="font-medium">{task.name}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                    <p className="mt-1 text-xs">
                      Priorytet: <span className="font-medium">{task.priority}</span>
                    </p>
                    <p className="mt-1 text-xs">
                      Czas: <span className="font-medium">{task.estimatedTime}h</span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 items-center">
                      {task.assignedUser ? (
                        <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                          👤{" "}
                          {users.find(u => u.id === task.assignedUser)?.firstName}{" "}
                          {users.find(u => u.id === task.assignedUser)?.lastName}
                        </span>
                      ) : (
                        <select
                          onChange={e => assign(task.id, Number(e.target.value))}
                          className="px-2 py-1 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded text-sm"
                        >
                          <option value="">Przypisz użytkownika</option>
                          {users
                            .filter(u => ["devops", "developer"].includes(u.role))
                            .map(u => (
                              <option key={u.id} value={u.id}>
                                {u.firstName} {u.lastName}
                              </option>
                            ))}
                        </select>
                      )}
                      {col.key === "doing" && (
                        <button
                          onClick={() => complete(task.id)}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded"
                        >
                          Zakończ
                        </button>
                      )}
                      <button
                        onClick={() => remove(task.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded"
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
