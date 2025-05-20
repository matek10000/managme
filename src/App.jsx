// src/App.jsx
import React, { useState, useEffect } from "react"
import Home from "./pages/Home"
import LoginPage from "./pages/LoginPage"
import AuthService from "./services/AuthService"
import ThemeToggle from "./components/ThemeToggle"

function App() {
  const [user, setUser] = useState(null)
  const [sessionTime, setSessionTime] = useState(null)

  useEffect(() => {
    const u = AuthService.getUser()
    if (u) {
      setUser(u)
      updateCountdown()
    }
    const iv = setInterval(updateCountdown, 1000)
    return () => clearInterval(iv)
  }, [])

  const updateCountdown = () => {
    const ms = AuthService.getSessionTimeLeft()
    if (ms <= 0) {
      AuthService.logout()
      setUser(null)
      setSessionTime(null)
    } else {
      setSessionTime(ms)
    }
  }

  const handleLogin = (u) => {
    setUser(u)
    updateCountdown()
  }

  const handleLogout = () => {
    AuthService.logout()
    setUser(null)
    setSessionTime(null)
  }

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900 p-6">
      {user ? (
        <>
          <header className="w-full max-w-4xl bg-gray-800 dark:bg-gray-200 p-4 rounded mb-6 flex items-center justify-between space-x-2">
            <div>
              <p>
                Zalogowany jako:{" "}
                <strong>
                  {user.firstName} {user.lastName}
                </strong>{" "}
                ({user.role})
              </p>
              <p>
                Sesja wygaśnie za:{" "}
                <strong>{formatTime(sessionTime)}</strong>
              </p>
            </div>
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
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  )
}

export default App
