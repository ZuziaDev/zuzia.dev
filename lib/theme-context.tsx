'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type Mode = 'light' | 'dark'
export type ColorTheme = 'purple' | 'blue' | 'green' | 'red' | 'orange' | 'pink' | 'cyan' | 'amber'

export interface ThemeContextType {
  mode: Mode
  colorTheme: ColorTheme
  setMode: (mode: Mode) => void
  setColorTheme: (theme: ColorTheme) => void
}

export const colorThemes = {
  purple: { name: 'Violet',   primary: '#8B5CF6', accent: '#A78BFA', ring: '#8B5CF6' },
  blue:   { name: 'Ocean',    primary: '#3B82F6', accent: '#60A5FA', ring: '#3B82F6' },
  green:  { name: 'Emerald',  primary: '#10B981', accent: '#34D399', ring: '#10B981' },
  red:    { name: 'Ruby',     primary: '#EF4444', accent: '#F87171', ring: '#EF4444' },
  orange: { name: 'Sunset',   primary: '#F97316', accent: '#FB923C', ring: '#F97316' },
  pink:   { name: 'Rose',     primary: '#EC4899', accent: '#F472B6', ring: '#EC4899' },
  cyan:   { name: 'Arctic',   primary: '#06B6D4', accent: '#22D3EE', ring: '#06B6D4' },
  amber:  { name: 'Gold',     primary: '#F59E0B', accent: '#FBBF24', ring: '#F59E0B' },
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  colorTheme: 'purple',
  setMode: () => {},
  setColorTheme: () => {},
})

function getInitialMode(): Mode {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const savedMode = localStorage.getItem('theme-mode')
  return savedMode === 'light' ? 'light' : 'dark'
}

function getInitialColorTheme(): ColorTheme {
  if (typeof window === 'undefined') {
    return 'purple'
  }

  const savedColor = localStorage.getItem('theme-color')

  if (savedColor && savedColor in colorThemes) {
    return savedColor as ColorTheme
  }

  return 'purple'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>(getInitialMode)
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(
    getInitialColorTheme
  )

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(mode)
    const theme = colorThemes[colorTheme]
    root.style.setProperty('--primary', theme.primary)
    root.style.setProperty('--ring', theme.ring)
    root.style.setProperty('--accent', theme.accent)
    root.style.setProperty('--glow-purple', theme.primary)
    localStorage.setItem('theme-mode', mode)
    localStorage.setItem('theme-color', colorTheme)
  }, [mode, colorTheme])

  return (
    <ThemeContext.Provider value={{
      mode,
      colorTheme,
      setMode: setModeState,
      setColorTheme: setColorThemeState,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Safe hook — never throws, always returns context (has default value)
export function useTheme(): ThemeContextType {
  return useContext(ThemeContext)
}
