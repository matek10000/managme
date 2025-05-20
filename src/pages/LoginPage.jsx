import React, { useState } from "react"
import AuthService from "../services/AuthService"

export default function LoginPage({ onLogin }) {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    const user = await AuthService.login(login, password)
    if (user) onLogin(user)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 dark:bg-gray-200 p-6 rounded space-y-4 w-full max-w-md"
    >
      <h1 className="text-2xl font-semibold text-center">Zaloguj się</h1>
      <input
        value={login}
        onChange={(e) => setLogin(e.target.value)}
        placeholder="Login"
        className="w-full px-3 py-2 bg-gray-700 dark:bg-white text-white dark:text-black rounded"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Hasło"
        className="w-full px-3 py-2 bg-gray-700 dark:bg-white text-white dark:text-black rounded"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-500 text-white dark:text-black py-2 rounded"
      >
        Zaloguj
      </button>
    </form>
  )
}
