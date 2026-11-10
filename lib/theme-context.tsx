'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type Mode = 'light' | 'dark'
export type ColorTheme =
  | 'flame'
  | 'purple'
  | 'blue'
  | 'green'
  | 'red'
  | 'orange'
  | 'pink'
  | 'cyan'
  | 'amber'

export interface ThemeContextType {
  mode: Mode
  colorTheme: ColorTheme
  setMode: (mode: Mode) => void
  setColorTheme: (theme: ColorTheme) => void
}

interface ThemeColors {
  name: string
  /** Flame core. `dark` is used on the night surface, `light` on the daylight surface (darker, for text contrast). */
  primary: { dark: string; light: string }
  /** Flame tip: the second, hotter colour of the pair. */
  heat: { dark: string; light: string }
}

export const DEFAULT_COLOR_THEME: ColorTheme = 'flame'

export const colorThemes: Record<ColorTheme, ThemeColors> = {
  flame:  { name: 'Flame',   primary: { dark: '#5B9BFF', light: '#1F5FE0' }, heat: { dark: '#FF8A3D', light: '#C2500A' } },
  purple: { name: 'Violet',  primary: { dark: '#A78BFA', light: '#6D3FE0' }, heat: { dark: '#F472B6', light: '#BE2A78' } },
  blue:   { name: 'Ocean',   primary: { dark: '#60A5FA', light: '#1D5FD0' }, heat: { dark: '#34D3C2', light: '#0C7A6E' } },
  green:  { name: 'Emerald', primary: { dark: '#34D399', light: '#0B7A55' }, heat: { dark: '#FACC15', light: '#8A6500' } },
  red:    { name: 'Ruby',    primary: { dark: '#F87171', light: '#C52222' }, heat: { dark: '#FBBF24', light: '#946200' } },
  orange: { name: 'Sunset',  primary: { dark: '#FB923C', light: '#B84A08' }, heat: { dark: '#F472B6', light: '#BE2A78' } },
  pink:   { name: 'Rose',    primary: { dark: '#F472B6', light: '#C02672' }, heat: { dark: '#A78BFA', light: '#6D3FE0' } },
  cyan:   { name: 'Arctic',  primary: { dark: '#22D3EE', light: '#0A7489' }, heat: { dark: '#A3E635', light: '#4F7A05' } },
  amber:  { name: 'Gold',    primary: { dark: '#FBBF24', light: '#8F5F00' }, heat: { dark: '#FB7185', light: '#C0263F' } },
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'dark',
  colorTheme: DEFAULT_COLOR_THEME,
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
    return DEFAULT_COLOR_THEME
  }

  const savedColor = localStorage.getItem('theme-color')

  if (savedColor && savedColor in colorThemes) {
    return savedColor as ColorTheme
  }

  return DEFAULT_COLOR_THEME
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
    root.style.setProperty('--primary', theme.primary[mode])
    root.style.setProperty('--ring', theme.primary[mode])
    root.style.setProperty('--heat', theme.heat[mode])
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
