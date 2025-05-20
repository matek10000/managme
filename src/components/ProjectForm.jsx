// src/components/ProjectForm.jsx
import React, { useState } from "react"
import ProjectService from "../services/ProjectService"

export default function ProjectForm({ onProjectAdded }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    ProjectService.addProject({ name, description })
    onProjectAdded()
    setName("")
    setDescription("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md space-y-4"
    >
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        ➕ Dodaj nowy projekt
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nazwa projektu
          </label>
          <input
            type="text"
            placeholder="Nazwa projektu"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Opis projektu
          </label>
          <textarea
            placeholder="Opis projektu"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded focus:outline-none resize-y"
            rows={2}
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Dodaj projekt
      </button>
    </form>
  )
}
