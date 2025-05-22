// src/components/StoriesModal.jsx
import React from "react"

export default function StoriesModal({ stories, onSelect, onClose }) {
  return (
    <div
      data-cy="stories-modal"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Wybierz historyjkę
          </h2>
          <button onClick={onClose} className="text-gray-600 dark:text-gray-300">
            ✕
          </button>
        </div>
        <div className="grid gap-3 max-h-80 overflow-y-auto">
          {stories.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">
              Brak historyjek
            </p>
          ) : (
            stories.map(s => (
              <div
                key={s.id}
                data-cy="stories-modal-card"
                onClick={() => {
                  onSelect(s)
                  onClose()
                }}
                className="cursor-pointer p-4 bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <h3 className="font-medium">{s.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {s.description}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
