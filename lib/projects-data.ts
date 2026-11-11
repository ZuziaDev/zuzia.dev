export interface Project {
  /** i18n key suffix: projects.items.<key>.title / .description */
  key: string
  /** file in /public */
  image: string
  /** optional looping clip in /public, shown in place of the image on the featured frame; image is the poster */
  video?: string
  techStack: string[]
  liveUrl?: string
  githubUrl?: string
  discordUrl?: string
  featured?: boolean
}

// EDIT YOUR PROJECTS HERE
export const projects: Project[] = [
  {
    key: 'varynth',
    image: '/varynth/varynth-poster.png',
    video: '/varynth/varynth-promo.mp4',
    techStack: ['Rust', 'TUI', 'MCP', 'AES-256', 'Next.js'],
    liveUrl: 'https://varynth.zuzia.dev',
    githubUrl: 'https://github.com/ZuziaDev/varynth',
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
]

export const GITHUB_USERNAME = 'ZuziaDev'
