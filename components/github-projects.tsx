'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, GitFork, ExternalLink, Github } from 'lucide-react'

// CHANGE THIS TO YOUR GITHUB USERNAME
const GITHUB_USERNAME = 'ZuziaDev'
const IGNORED_REPO_FULL_NAMES = new Set([`${GITHUB_USERNAME}/${GITHUB_USERNAME}`])

interface Repository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
}

const languageColors: Record<string, string> = {
  TypeScript: 'bg-blue-400',
  JavaScript: 'bg-yellow-400',
  Python: 'bg-cyan-600',
  Rust: 'bg-orange-400',
  Go: 'bg-cyan-400',
  Java: 'bg-red-400',
  'C++': 'bg-pink-400',
  C: 'bg-gray-400',
  Ruby: 'bg-red-500',
  PHP: 'bg-indigo-400',
  Swift: 'bg-orange-500',
  Kotlin: 'bg-purple-400',
  Dart: 'bg-teal-400',
}

function SkeletonCard() {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="h-6 bg-secondary/50 rounded w-3/4 mb-3" />
      <div className="h-4 bg-secondary/30 rounded w-full mb-2" />
      <div className="h-4 bg-secondary/30 rounded w-2/3 mb-4" />
      <div className="flex gap-4">
        <div className="h-4 bg-secondary/30 rounded w-16" />
        <div className="h-4 bg-secondary/30 rounded w-16" />
      </div>
    </div>
  )
}

export function GitHubProjects() {
  const [repos, setRepos] = useState<Repository[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRepos() {
      try {
        const response = await fetch(
          `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=stars&per_page=17`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch repositories')
        }
        const data = (await response.json()) as Repository[]
        const filteredRepos = data.filter(
          (repo) => !IGNORED_REPO_FULL_NAMES.has(repo.full_name)
        )
        setRepos(filteredRepos)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    fetchRepos()
  }, [])

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 mb-8"
      >
        <Github className="w-6 h-6 text-primary" />
        <h3 className="text-2xl font-bold">Open Source</h3>
        <span className="text-sm font-mono text-muted-foreground">@{GITHUB_USERNAME}</span>
      </motion.div>

      {error ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-8 text-center"
        >
          <p className="text-muted-foreground mb-4">Unable to load GitHub repositories</p>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            View on GitHub <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            : repos.map((repo, index) => (
                <motion.a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="glass-card p-6 group cursor-pointer hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                      {repo.name}
                    </h4>
                    <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                    {repo.description || 'No description available'}
                  </p>

                  <div className="flex items-center gap-4 text-sm">
                    {repo.language && (
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-3 h-3 rounded-full ${languageColors[repo.language] || 'bg-gray-400'}`}
                        />
                        <span className="font-mono text-muted-foreground">{repo.language}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Star className="w-4 h-4" />
                      <span>{repo.stargazers_count}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <GitFork className="w-4 h-4" />
                      <span>{repo.forks_count}</span>
                    </div>
                  </div>
                </motion.a>
              ))}
        </div>
      )}
    </div>
  )
}
