"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Music, Pause } from "lucide-react"
import { Card } from "@/components/ui/card"

interface LanyardData {
  spotify?: {
    album_art_url: string
    album: string
    artist: string
    song: string
    timestamps: {
      start: number
      end: number
    }
  }
  listening_to_spotify: boolean
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`
}

export default function SpotifyNowPlaying({ discordId }: { discordId: string }) {
  const [spotifyData, setSpotifyData] = useState<LanyardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const fetchLanyardData = async () => {
      try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch Lanyard data")
        }
        const data = await response.json()
        setSpotifyData(data.data)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching Lanyard data:", err)
        setError("Failed to load Spotify data")
        setLoading(false)
      }
    }

    fetchLanyardData()

    // Set up polling every 30 seconds
    const intervalId = setInterval(fetchLanyardData, 30000)

    return () => clearInterval(intervalId)
  }, [discordId])

  // Update progress bar
  useEffect(() => {
    if (!spotifyData?.listening_to_spotify || !spotifyData.spotify?.timestamps) {
      return
    }

    const updateProgress = () => {
      if (!spotifyData.spotify?.timestamps) return

      const { start, end } = spotifyData.spotify.timestamps
      const now = Date.now()
      const total = end - start
      const current = now - start
      const percentage = Math.min(100, (current / total) * 100)

      setProgress(percentage)
    }

    // Update immediately
    updateProgress()

    // Then update every second
    const interval = setInterval(updateProgress, 1000)

    return () => clearInterval(interval)
  }, [spotifyData])

  if (loading) {
    return (
      <Card className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-700">
        <div className="flex items-center justify-center space-x-4">
          <div className="w-16 h-16 bg-neutral-800 rounded-md animate-pulse"></div>
          <div className="flex-1">
            <div className="h-5 bg-neutral-800 rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-neutral-800 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-700">
        <div className="flex items-center justify-center text-neutral-400">
          <Music className="w-5 h-5 mr-2" />
          <span>Unable to load Spotify data</span>
        </div>
      </Card>
    )
  }

  if (!spotifyData?.listening_to_spotify) {
    return (
      <Card className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-neutral-900 to-neutral-800 border-neutral-700">
        <div className="flex items-center justify-center text-neutral-400">
          <Pause className="w-5 h-5 mr-2" />
          <span>Not currently listening to Spotify</span>
        </div>
      </Card>
    )
  }

  const { spotify } = spotifyData

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="overflow-hidden bg-gradient-to-br from-[#1e1033] to-[#2a1a45] border-0 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none"></div>
        <div className="p-4 relative z-10">
          <div className="flex items-center space-x-4">
            {spotify?.album_art_url && (
              <img
                src={spotify.album_art_url || "/placeholder.svg"}
                alt={`${spotify.album} album cover`}
                className="w-16 h-16 object-cover rounded-md shadow-lg"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate text-white">{spotify?.song}</p>
              <p className="text-sm text-gray-300 truncate">{spotify?.artist}</p>
            </div>
          </div>
        </div>

        <div className="px-4 pb-4 relative z-10">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>
              {spotify && spotify.timestamps ? formatTime((Date.now() - spotify.timestamps.start) / 1000) : "0:00"}
            </span>
            <span>
              {spotify && spotify.timestamps
                ? formatTime((spotify.timestamps.end - spotify.timestamps.start) / 1000)
                : "0:00"}
            </span>
          </div>

          <div className="h-1.5 w-full bg-gray-700/50 rounded-full overflow-hidden backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-center mt-4 space-x-6">
            <button className="text-gray-300 hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 20L9 12l10-8v16z"></path>
                <path d="M5 19V5"></path>
              </svg>
            </button>
            <button className="text-black bg-white rounded-full p-1 hover:bg-gray-200 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="6" y="4" width="4" height="16"></rect>
                <rect x="14" y="4" width="4" height="16"></rect>
              </svg>
            </button>
            <button className="text-gray-300 hover:text-white transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 4l10 8-10 8V4z"></path>
                <path d="M19 5v14"></path>
              </svg>
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

