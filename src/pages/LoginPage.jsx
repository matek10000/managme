import React, { useState } from "react"
import AuthService from "../services/AuthService"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] = useState("login") // "login" lub "register"
  const [error, setError] = useState("")

  const handleEmailAuth = async (e) => {
    e.preventDefault()
    setError("")
    try {
      if (mode === "login") {
        await AuthService.loginWithEmail(email, password)
      } else {
        await AuthService.registerWithEmail(email, password)
      }
    } catch (err) {
      console.error(err)
      setError(err.message || "Coś poszło nie tak")
    }
  }

  const handleGoogleLogin = async () => {
    setError("")
    try {
      await AuthService.loginWithGoogle()
    } catch (err) {
      console.error("Błąd logowania Google:", err)
      setError("Nie udało się zalogować przez Google")
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold text-center">
          {mode === "login" ? "Zaloguj się" : "Zarejestruj się"}
        </h1>

        {error && (
          <div className="text-sm text-red-600 bg-red-100 dark:bg-red-200 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Hasło"
            required
            className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            {mode === "login" ? "Zaloguj" : "Zarejestruj"}
          </button>
        </form>

        <div className="flex items-center justify-center space-x-2">
          <span className="text-gray-500 dark:text-gray-400 text-sm">lub</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
        >
          {/* ikona Google jak wcześniej */}
          Zaloguj przez Google
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          {mode === "login" ? "Nie masz konta?" : "Masz już konto?"}{" "}
          <button
            onClick={() => {
              setMode(mode === "login" ? "register" : "login")
              setError("")
            }}
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            {mode === "login" ? "Zarejestruj się" : "Zaloguj"}
          </button>
        </p>
      </div>
    </div>
)
}
