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
      // onAuthChange w App.jsx przejmie stan i przekieruje do Home
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
        <h1 className="text-2xl font-semibold text-center text-gray-800 dark:text-gray-100">
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
          <svg
            className="w-5 h-5"
            viewBox="0 0 533.5 544.3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M533.5 278.4c0-17.1-1.5-34.1-4.6-50.5H272v95.6h146.9c-6.4 34.6-25.5 63.9-54.6 83.5v69.4h88.5c51.9-47.8 81.7-118.3 81.7-197.9z"
              fill="#4285f4"
            />
            <path
              d="M272 544.3c73.6 0 135.4-24.4 180.6-66.3l-88.5-69.4c-24.5 16.3-55.8 25.8-92.1 25.8-70.8 0-130.8-47.9-152.2-112.2h-90.2v70.6c45.4 89.5 138.9 151.5 242.4 151.5z"
              fill="#34a853"
            />
            <path
              d="M119.8 324.7c-11.2-33.4-11.2-69.4 0-102.8v-70.6h-90.2c-39.9 79.8-39.9 175.6 0 255.4l90.2-82z"
              fill="#fbbc04"
            />
            <path
              d="M272 107.7c39.9-.6 78.2 14.1 107.3 40.6l80.5-80.5C407.3 23.5 343.9-1.7 272 0 168.5 0 75 62 29.6 151.5l90.2 70.6C141.2 155.6 201.2 107.7 272 107.7z"
              fill="#ea4335"
            />
          </svg>
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
