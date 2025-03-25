"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Github, Instagram, Youtube, Twitter } from "lucide-react"
import BackgroundPaths from "@/components/background-paths"
import ThemeToggle from "@/components/theme-toggle"
import SpotifyNowPlaying from "@/components/spotify-now-playing"
import ProjectCard from "@/components/project-card"

// Discord ID for Lanyard API
const DISCORD_ID = "890626326350946364"

// Gradient colors for projects
const GRADIENT_COLORS = [
  "from-purple-600 to-blue-600",
  "from-pink-600 to-purple-600",
  "from-blue-600 to-cyan-600",
  "from-green-600 to-teal-600",
  "from-yellow-600 to-amber-600",
  "from-red-600 to-orange-600",
  "from-indigo-600 to-violet-600",
  "from-teal-600 to-emerald-600",
  "from-orange-600 to-rose-600",
  "from-cyan-600 to-sky-600",
  "from-amber-600 to-yellow-600",
  "from-violet-600 to-fuchsia-600",
  "from-lime-600 to-green-600",
  "from-rose-600 to-pink-600",
  "from-sky-600 to-indigo-600",
  "from-fuchsia-600 to-purple-600",
  "from-lime-600 to-fuchsia-600",
  "from-emerald-600 to-lime-600",
  "from-gray-600 to-slate-600",
  "from-slate-600 to-zinc-600",
  "from-zinc-600 to-neutral-600",
  "from-neutral-600 to-stone-600",
  "from-stone-600 to-gray-600",
]

// Fallback projects data
const FALLBACK_PROJECTS = [
  {
    id: 1,
    name: "zuzia.dev",
    description: "Zuzia.dev Web Sitesi",
    technologies: ["TypeScript","JavaScript", "CSS"],
    url: "https://github.com/ZuziaDev/zuzia.dev",
    updatedAt: "3 years ago",
    color: "from-lime-600 to-fuchsia-600",
  },
  {
    id: 2,
    name: "Zuzia-Code-Api-v2",
    description: "Zuzia API 2.0.0",
    technologies: ["JavaScript", "HTML"],
    url: "https://github.com/ZuziaDev/Zuzia-Code-Api-v2",
    updatedAt: "3 years ago",
    color: "from-purple-600 to-blue-600",
  },
  {
    id: 3,
    name: "Zuzia-Site-v2",
    description: "Zuzia Site V2.0.0",
    technologies: ["JavaScript", "EJS", "CSS"],
    url: "https://github.com/ZuziaDev/Zuzia-Site-v2",
    updatedAt: "2 years ago",
    color: "from-pink-600 to-purple-600",
  },
  {
    id: 4,
    name: "Discord.js-v14-bos-altyapi",
    description: "Discord.js V14 Slash Boş Altyapı",
    technologies: ["JavaScript"],
    url: "https://github.com/ZuziaDev/Discord.js-v14-bos-altyapi",
    updatedAt: "2 years ago",
    color: "from-emerald-600 to-lime-600",
  },
]


interface Project {
  id: number
  name: string
  description: string
  technologies: string[]
  url: string
  updatedAt: string
  color?: string
}

export default function PersonalWebsite() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Since we're having issues with fetching the JSON file,
    // let's use the hardcoded data directly
    const loadProjects = () => {
      try {
        setLoading(true)

        // Use the fallback projects directly
        setProjects(FALLBACK_PROJECTS)

        // You can uncomment this fetch code later when you've confirmed
        // the JSON file is properly accessible
        /*
        // For debugging - log the full URL we're trying to fetch
        const jsonUrl = new URL('/github.json', window.location.origin).href
        console.log('Attempting to fetch from:', jsonUrl)
        
        const response = await fetch(jsonUrl)
        
        if (!response.ok) {
          throw new Error(`Failed to load projects: ${response.status}`)
        }
        
        // Check content type to ensure we're getting JSON
        const contentType = response.headers.get('content-type')
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error(`Expected JSON but got ${contentType}`)
        }
        
        const data = await response.json()
        
        if (!Array.isArray(data)) {
          throw new Error("Invalid data format: expected an array")
        }
        
        setProjects(data)
        */
      } catch (err) {
        console.error("Error loading projects:", err)
        setError(`${err.message || "Unknown error"}`)

        // Always fall back to hardcoded projects
        setProjects(FALLBACK_PROJECTS)
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [])

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-neutral-100">
      <BackgroundPaths />

      <div className="absolute top-4 right-4 z-50">
        
      </div>

      <div className="relative z-20 container mx-auto px-4 py-16 flex flex-col items-center">
        <div className="w-full max-w-4xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500">
              Zuzia RodzeN
            </h1>
          </motion.div>

          {/* Social Links */}
          <div className="flex justify-center gap-4 mt-8 mb-12">
            <SocialLink
              href="https://github.com/ZuziaDev"
              icon={<Github className="w-5 h-5" />}
              label="GitHub"
              color="hover:bg-purple-600"
            />
            <SocialLink
              href="https://instagram.com/ridvan.veli.0"
              icon={<Instagram className="w-5 h-5" />}
              label="Instagram"
              color="hover:bg-pink-600"
            />
            <SocialLink
              href="https://x.com/ZuziaInc"
              icon={<Twitter className="w-5 h-5" />}
              label="X"
              color="hover:bg-blue-600"
            />
            <SocialLink
              href="https://youtube.com/ZuziaInc"
              icon={<Youtube className="w-5 h-5" />}
              label="YouTube"
              color="hover:bg-red-600"
            />
            <SocialLink
              href="https://youtube.com/ZuziaKirai"
              icon={<Youtube className="w-5 h-5" />}
              label="YouTube"
              color="hover:bg-red-600"
            />
            <SocialLink
              href="https://discord.gg/StZjQ6T5Cm"
              icon={<Discord className="w-5 h-5" />}
              label="Discord"
              color="hover:bg-red-600"
            />
          </div>

          {/* Spotify Now Playing */}
          <div className="mb-16">
            <SpotifyNowPlaying discordId={DISCORD_ID} />
          </div>

          {/* Projects Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="w-full"
          >
            <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              My Projects
            </h2>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 bg-[#1e1033] border border-[#2a1a45] rounded-lg animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center p-6 bg-[#1e1033] border border-[#2a1a45] rounded-lg">
                <p className="text-red-400 mb-2">{error}</p>
                <p className="text-gray-400">Using fallback projects</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function SocialLink({
  href,
  icon,
  label,
  color,
}: {
  href: string
  icon: React.ReactNode
  label: string
  color: string
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-center w-10 h-10 rounded-full 
                bg-neutral-800 hover:bg-neutral-700 transition-colors duration-200 ${color}`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
      title={label}
    >
      {icon}
    </motion.a>
  )
}

