import React, { useState, useEffect } from "react"

export default function ThemeToggle() {
  // Odczytujemy zapisany motyw lub domyślnie 'light'
  const [mode, setMode] = useState(() => {
    return localStorage.getItem("theme") || "light"
  })

  // Zaaplikuj motyw (dodaj/usuń klasę .dark)
  useEffect(() => {
    const root = window.document.documentElement
    if (mode === "dark") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
    localStorage.setItem("theme", mode)
  }, [mode])

  // Przełącznik
  const toggle = () => {
    setMode((m) => (m === "dark" ? "light" : "dark"))
  }

  return (
    <button
      onClick={toggle}
      className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-100"
      aria-label="Przełącz motyw"
    >
      {mode === "dark" ? "🌞 Jasny" : "🌙 Ciemny"}
    </button>
  )
}
