import React from "react"

export default function ProjectsModal({ projects, onClose, onSelect }) {
  return (
    <div
      data-cy="projects-modal"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Wybierz projekt
          </h2>
          <button onClick={onClose} className="text-gray-600 dark:text-gray-300 hover:text-gray-900">
            ✕
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
          {projects.length === 0 ? (
            <p className="col-span-full text-center text-gray-600 dark:text-gray-400">
              Brak projektów
            </p>
          ) : (
            projects.map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  onSelect(p)
                  onClose()
                }}
                className="cursor-pointer p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
                  {p.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {p.description}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
