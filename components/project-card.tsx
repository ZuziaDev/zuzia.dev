"use client"

import { motion } from "framer-motion"
import { Github } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface Project {
  id: number
  name: string
  description: string
  technologies: string[]
  url: string
  updatedAt?: string
  color?: string
}

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className={`h-full flex flex-col bg-[#1e1033] border-[#2a1a45] overflow-hidden text-white`}>
        <div className={`h-1 w-full bg-gradient-to-r ${project.color || "from-purple-600 to-blue-600"}`}></div>
        <CardHeader className="pb-2">
          <CardTitle className="flex justify-between items-center text-white">
            <span>{project.name}</span>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
              aria-label={`View ${project.name} on GitHub`}
            >
              <Github className="h-5 w-5" />
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow pb-2">
          <p className="text-gray-300 mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-xs rounded-full flex items-center ${
                  tech === "TypeScript"
                    ? "bg-[#3178c6] text-white"
                    : tech === "JavaScript"
                      ? "bg-[#f7df1e] text-black"
                      : tech === "Python"
                        ? "bg-[#3572A5] text-white"
                        : tech === "HTML"
                          ? "bg-[#E34F26] text-white"
                          : tech === "CSS"
                            ? "bg-[#1572B6] text-white"
                            : tech === "EJS"
                              ? "bg-[#c56eff] text-white"
                              : "bg-gray-700 text-white"
                }`}
              >
                <span className="w-2 h-2 rounded-full mr-1.5 bg-current"></span>
                {tech}
              </span>
            ))}
          </div>
        </CardContent>
        <CardFooter className="pt-0 flex justify-between items-center text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span>★ {Math.floor(Math.random() * 8) + 1}</span>
            <span>🍴 {Math.floor(Math.random() * 2)}</span>
          </div>
          {project.updatedAt && <span>Updated: {project.updatedAt}</span>}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

