"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { motion } from "framer-motion"

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    } else {
      setIsDark(false)
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
      setIsDark(false)
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
      setIsDark(true)
    }
  }

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <button
        onClick={toggleTheme}
        className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden ${
          isDark
            ? "bg-neutral-800 border border-neutral-700 hover:bg-neutral-700"
            : "bg-white border border-gray-200 hover:bg-gray-100"
        }`}
        aria-label="Toggle theme"
      >
        <div
          className={`absolute inset-0 bg-gradient-to-br ${
            isDark
              ? "from-purple-500/10 via-transparent to-blue-500/10"
              : "from-purple-500/5 via-transparent to-blue-500/5"
          } pointer-events-none`}
        ></div>
        {isDark ? <Moon className="h-5 w-5 text-yellow-300" /> : <Sun className="h-5 w-5 text-yellow-500" />}
      </button>
    </motion.div>
  )
}

