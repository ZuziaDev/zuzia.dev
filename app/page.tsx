import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { Timeline } from '@/components/timeline'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Navbar />
      <Hero />
      <About />
      <Timeline />
      <Footer />
    </main>
  )
}
