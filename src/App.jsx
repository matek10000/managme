import React, { useState, useEffect } from "react"
import Home from "./pages/Home"
import LoginPage from "./pages/LoginPage"
import AuthService from "./services/AuthService"
import ThemeToggle from "./components/ThemeToggle"

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = AuthService.onAuthChange((u) => {
      setUser(u)
    })
    return unsubscribe
  }, [])

  const handleLogout = () => {
    AuthService.logout()
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6">
      {user ? (
        <>
          <header className="w-full max-w-4xl bg-gray-200 dark:bg-gray-800 p-4 rounded mb-6 flex items-center justify-between">
            <p>
              Zalogowany jako:{" "}
              <strong>{user.displayName || user.email}</strong> ({user.role})
            </p>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white"
              >
                Wyloguj
              </button>
            </div>
          </header>

          <main className="w-full max-w-4xl flex-1">
            <Home />
          </main>

          <footer className="mt-6 text-sm text-center text-gray-500 dark:text-gray-400">
            Mateusz Dybaś 2025
          </footer>
        </>
      ) : (
        <LoginPage />
      )}
    </div>
  )
}
