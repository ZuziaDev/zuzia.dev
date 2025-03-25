import { NextResponse } from "next/server"

// GitHub projects data
const githubProjects = [
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

export async function GET() {
  return NextResponse.json(githubProjects)
}

