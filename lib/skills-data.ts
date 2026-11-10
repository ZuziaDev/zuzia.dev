import type { IconType } from 'react-icons'
import {
  SiAnthropic,
  SiArkecosystem,
  SiBun,
  SiCloudinary,
  SiCss,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiFlydotio,
  SiFramer,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiLinux,
  SiMeta,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenai,
  SiPenpot,
  SiPython,
  SiPytorch,
  SiReact,
  SiRedis,
  SiRender,
  SiResend,
  SiRust,
  SiSocketdotio,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from 'react-icons/si'
import { GrGenai } from 'react-icons/gr'

export type SkillCategoryKey =
  | 'languages'
  | 'frontend'
  | 'aiMl'
  | 'backend'
  | 'devops'
  | 'system'
  | 'design'
  | 'databaseCloud'

export interface Skill {
  /** Stable, unique across the whole list. Also used as the DOM id suffix of the row. */
  id: string
  name: string
  icon: IconType
  /** Self-assessed level, 0 to 100. */
  level: number
  category: SkillCategoryKey
}

export interface SkillCategory {
  key: SkillCategoryKey
  skills: Skill[]
}

type RawSkill = Pick<Skill, 'name' | 'icon' | 'level'>

const raw: { key: SkillCategoryKey; skills: RawSkill[] }[] = [
  {
    key: 'languages',
    skills: [
      { name: 'JavaScript', icon: SiJavascript, level: 90 },
      { name: 'TypeScript', icon: SiTypescript, level: 85 },
      { name: 'Python', icon: SiPython, level: 45 },
      { name: 'Rust', icon: SiRust, level: 45 },
      { name: 'HTML', icon: SiHtml5, level: 45 },
      { name: 'CSS', icon: SiCss, level: 45 },
    ],
  },
  {
    key: 'frontend',
    skills: [
      { name: 'React', icon: SiReact, level: 65 },
      { name: 'Next.js', icon: SiNextdotjs, level: 65 },
      { name: 'Tailwind CSS', icon: SiTailwindcss, level: 45 },
      { name: 'Ark UI', icon: SiArkecosystem, level: 40 },
      { name: 'Framer Motion', icon: SiFramer, level: 58 },
    ],
  },
  {
    key: 'aiMl',
    skills: [
      { name: 'OpenAI', icon: SiOpenai, level: 75 },
      { name: 'Anthropic', icon: SiAnthropic, level: 75 },
      { name: 'GenAI', icon: GrGenai, level: 75 },
      { name: 'Meta AI', icon: SiMeta, level: 68 },
      { name: 'PyTorch', icon: SiPytorch, level: 15 },
    ],
  },
  {
    key: 'backend',
    skills: [
      { name: 'Node.js', icon: SiNodedotjs, level: 90 },
      { name: 'Bun.js', icon: SiBun, level: 65 },
      { name: 'Express.js', icon: SiExpress, level: 85 },
      { name: 'Socket.IO', icon: SiSocketdotio, level: 54 },
      { name: 'Resend', icon: SiResend, level: 60 },
    ],
  },
  {
    key: 'devops',
    skills: [
      { name: 'Vercel', icon: SiVercel, level: 78 },
      { name: 'Render', icon: SiRender, level: 55 },
      { name: 'Fly.io', icon: SiFlydotio, level: 20 },
    ],
  },
  {
    key: 'system',
    skills: [
      { name: 'Git', icon: SiGit, level: 66 },
      { name: 'Redis', icon: SiRedis, level: 41 },
      { name: 'Linux', icon: SiLinux, level: 38 },
    ],
  },
  {
    key: 'design',
    skills: [
      { name: 'Figma', icon: SiFigma, level: 67 },
      { name: 'Penpot', icon: SiPenpot, level: 34 },
      { name: 'Framer', icon: SiFramer, level: 35 },
    ],
  },
  {
    key: 'databaseCloud',
    skills: [
      { name: 'Firebase Realtime', icon: SiFirebase, level: 82 },
      { name: 'Cloudinary', icon: SiCloudinary, level: 45 },
      { name: 'Firebase Storage', icon: SiFirebase, level: 45 },
    ],
  },
]

const slug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export const skillCategories: SkillCategory[] = raw.map((category) => ({
  key: category.key,
  skills: category.skills.map((skill) => ({
    ...skill,
    id: `${slug(category.key)}-${slug(skill.name)}`,
    category: category.key,
  })),
}))

export const allSkills: Skill[] = skillCategories.flatMap((category) => category.skills)

export const skillRowId = (id: string) => `skill-${id}`

/** Flame colour for a level: flame core at 0, flame tip at 100. */
export const heatColor = (level: number) =>
  `color-mix(in oklab, var(--heat) ${Math.max(0, Math.min(100, level))}%, var(--primary))`
