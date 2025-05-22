import React, { useState } from "react"
import ProjectService from "../services/ProjectService"

export default function ProjectList({ projects, onUpdate, onDelete, onSelect }) {
  const [editProjectId, setEditProjectId] = useState(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const currentProject = ProjectService.getCurrentProject()

  const startEdit = (project) => {
    setEditProjectId(project.id)
    setName(project.name)
    setDescription(project.description)
  }

  const saveEdit = () => {
    const updated = { id: editProjectId, name, description }
    ProjectService.updateProject(updated)
    onUpdate()
    setEditProjectId(null)
  }

  return (
    <div className="space-y-4">
      {projects.length === 0 ? (
        <p className="text-gray-500">Brak projektów</p>
      ) : (
        projects.map((project) => {
          const isActive = currentProject?.id === project.id
          return (
            <div
              key={project.id}
              className={`p-4 rounded-lg shadow-md bg-white dark:bg-gray-700 flex flex-col md:flex-row md:justify-between items-start md:items-center gap-4
                ${isActive ? "ring-2 ring-blue-500" : ""}
              `}
            >
              {editProjectId === project.id ? (
                <div className="flex-1 space-y-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded"
                  />
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded resize-y"
                    rows={2}
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {project.name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">{project.description}</p>
                </div>
              )}

              <div className="flex gap-2">
                {isActive && editProjectId !== project.id && (
                  <button
                    onClick={() => startEdit(project)}
                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                  >
                    Edytuj
                  </button>
                )}
                {editProjectId === project.id ? (
                  <>
                    <button
                      onClick={saveEdit}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                    >
                      Zapisz
                    </button>
                    <button
                      onClick={() => setEditProjectId(null)}
                      className="px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white rounded"
                    >
                      Anuluj
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => onSelect(project)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    Wybierz
                  </button>
                )}
                {isActive && (
                  <button
                    onClick={() => onDelete(project.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                  >
                    Usuń
                  </button>
                )}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
