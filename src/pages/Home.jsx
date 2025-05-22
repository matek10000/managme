import React, { useState, useEffect } from "react"
import ProjectService from "../services/ProjectService"
import AuthService from "../services/AuthService"
import Stories from "../components/Stories"
import TaskBoard from "../components/TaskBoard"
import ProjectForm from "../components/ProjectForm"
import ProjectsModal from "../components/ProjectsModal"

export default function Home() {
  const [projects, setProjects] = useState([])
  const [currentProject, setCurrentProject] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const user = AuthService.getUser()
  const isGuest = user?.role === "guest"

  // Ładowanie projektów
  const loadProjects = async () => {
    const all = await ProjectService.getProjects()
    setProjects(all)
  }

  useEffect(() => {
    loadProjects()
  }, [])

  // Ustawienie projektu po wyborze z modal
  const handleSelectProject = (proj) => {
    setCurrentProject(proj)
    setEditMode(false)
  }

  // Usuń projekt
  const handleDeleteProject = async () => {
    if (isGuest || !currentProject) return
    await ProjectService.deleteProject(currentProject.id)
    await loadProjects()
    setCurrentProject(null)
    setEditMode(false)
  }

  // Zapisz zmiany projektu
  const handleEditProject = async () => {
    if (isGuest || !currentProject) return
    await ProjectService.updateProject(currentProject.id, { name, description })
    const updated = await ProjectService.getProject(currentProject.id)
    setCurrentProject(updated)
    await loadProjects()
    setEditMode(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Dodawanie projektu - goście nie widzą formy */}
        {!isGuest && <ProjectForm onProjectAdded={loadProjects} />}

        {/* Przycisk otwierający modal z projektami */}
        <div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
          >
            Projekty
          </button>
          {currentProject && (
            <span className="ml-4 text-lg">
              Aktywny projekt: <strong>{currentProject.name}</strong>
            </span>
          )}
        </div>

        {/* Modal wyboru projektu */}
        {showModal && (
          <ProjectsModal
            projects={projects}
            onClose={() => setShowModal(false)}
            onSelect={handleSelectProject}
          />
        )}

        {/* Szczegóły projektu */}
        {currentProject ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6 space-y-6">
            {editMode ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Edytuj projekt</h2>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nazwa projektu"
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none"
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Opis projektu"
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded focus:outline-none resize-y"
                />
                <div className="flex gap-4">
                  {!isGuest && (
                    <button
                      onClick={handleEditProject}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                    >
                      Zapisz
                    </button>
                  )}
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded"
                  >
                    Anuluj
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-semibold">{currentProject.name}</h2>
                    <p className="text-gray-600 dark:text-gray-300">{currentProject.description}</p>
                  </div>
                  {!isGuest && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setEditMode(true)
                          setName(currentProject.name)
                          setDescription(currentProject.description)
                        }}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                      >
                        Edytuj projekt
                      </button>
                      <button
                        onClick={handleDeleteProject}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                      >
                        Usuń projekt
                      </button>
                    </div>
                  )}
                </div>

                <section>
                  <h3 className="text-xl font-semibold mb-2">📚 Historyjki</h3>
                  <Stories projectId={currentProject.id} />
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-2">📋 Zadania</h3>
                  <TaskBoard projectId={currentProject.id} />
                </section>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">
            Wybierz projekt, aby zobaczyć szczegóły.
          </p>
        )}
      </div>
    </div>
  )
}
