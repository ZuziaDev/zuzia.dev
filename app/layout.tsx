import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Zuzia RodzeN',
  description: 'Created with Zuzia RodzeN',
  generator: 'zuzia.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
