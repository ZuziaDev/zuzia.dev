export interface Project {
  /** i18n key suffix: projects.items.<key>.title / .description */
  key: string
  /** file in /public */
  image: string
  techStack: string[]
  liveUrl?: string
  githubUrl?: string
  discordUrl?: string
  featured?: boolean
}

// EDIT YOUR PROJECTS HERE
export const projects: Project[] = [
  {
    key: 'neuroa',
    image: '/neuroa_banner.png',
    techStack: ['JavaScript', 'Next.js', 'Firebase', 'Redis'],
    liveUrl: 'https://patreon.com/NeuroaAI',
    discordUrl: 'https://discord.gg/gSfkTJkr5U',
    featured: true,
  },
  {
    key: 'noteai',
    image: '/noteai.png',
    techStack: ['TypeScript', 'OpenAI', 'Electron', 'Vite', 'React', 'Firebase'],
    githubUrl: 'https://github.com/ZuziaDev/NoteAI',
  },
  {
    key: 'mirai',
    image: '/mirai.png',
    techStack: ['Python', 'GenAI'],
    githubUrl: 'https://github.com/ZuziaDev/Mirai-2.0',
  },
  {
    key: 'neuroaBot',
    image: '/neuroa_banner.png',
    techStack: ['JavaScript', 'Node.JS', 'Firebase', 'NeuroaAI'],
    liveUrl: 'https://neuroa.pro',
    discordUrl: 'https://discord.gg/gSfkTJkr5U',
  },
]

export const GITHUB_USERNAME = 'ZuziaDev'
