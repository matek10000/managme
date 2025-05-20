import React, { useState, useEffect } from "react"
import ProjectService from "../services/ProjectService"
import AuthService from "../services/AuthService"
import Stories from "../components/Stories"
import TaskBoard from "../components/TaskBoard"
import ThemeToggle from "../components/ThemeToggle"

export default function Home() {
  const [projects, setProjects] = useState([])
  const [currentProject, setCurrentProject] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const user = AuthService.getUser()
  const isGuest = user?.role === "guest"

  // Załaduj wszystkie projekty
  useEffect(() => {
    async function load() {
      const all = await ProjectService.getProjects()
      setProjects(all)
    }
    load()
  }, [])

  // Gdy wybierzesz projekt, pobierz jego szczegóły
  const handleSelectProject = async (e) => {
    const id = e.target.value
    if (!id) {
      setCurrentProject(null)
      return
    }
    const proj = await ProjectService.getProject(id)
    setCurrentProject(proj)
    setEditMode(false)
  }

  const handleDeleteProject = async () => {
    if (isGuest || !currentProject) return
    await ProjectService.deleteProject(currentProject.id)
    const all = await ProjectService.getProjects()
    setProjects(all)
    setCurrentProject(null)
    setEditMode(false)
  }

  const handleEditProject = async () => {
    if (isGuest || !currentProject) return
    await ProjectService.updateProject(currentProject.id, { name, description })
    const updated = await ProjectService.getProject(currentProject.id)
    setCurrentProject(updated)
    const all = await ProjectService.getProjects()
    setProjects(all)
    setEditMode(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Nagłówek */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold">ManagMe</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Zarządzanie Projektami
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <span className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a4 4 0 110 8 4 4 0 010-8zM2 18a8 8 0 1116 0H2z" />
              </svg>
              <span>
                {user.displayName || user.email} ({user.role})
              </span>
            </span>
            <ThemeToggle />
          </div>
        </header>

        {/* Wybór projektu */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <label htmlFor="projectSelect" className="font-medium">
            Wybierz projekt:
          </label>
          <select
            id="projectSelect"
            value={currentProject?.id || ""}
            onChange={handleSelectProject}
            className="flex-1 px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm focus:outline-none"
          >
            <option value="">– wybierz –</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

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
                    <h2 className="text-2xl font-semibold">
                      {currentProject.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {currentProject.description}
                    </p>
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
                        Edytuj
                      </button>
                      <button
                        onClick={handleDeleteProject}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded"
                      >
                        Usuń
                      </button>
                    </div>
                  )}
                </div>

                {/* Historyjki */}
                <section>
                  <h3 className="text-xl font-semibold mb-2">📚 Historyjki</h3>
                  <Stories projectId={currentProject.id} />
                </section>

                {/* Tablica zadań */}
                <section>
                  <h3 className="text-xl font-semibold mb-2">📋 Tablica zadań</h3>
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
