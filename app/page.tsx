import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { About } from '@/components/about'
import { HomeStack } from '@/components/home-stack'
import { HomeWork } from '@/components/home-work'
import { Timeline } from '@/components/timeline'
import { HomeContact } from '@/components/home-contact'
import { Footer } from '@/components/footer'

export default function Home() {
  // No overflow clipping here: About and Timeline rely on position: sticky.
  return (
    <main id="main" className="relative min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <HomeStack />
      <HomeWork />
      <Timeline />
      <HomeContact />
      <Footer />
    </main>
  )
}
