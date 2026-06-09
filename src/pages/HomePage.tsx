import { Hero } from '../components/Hero'
import { About } from '../components/About'
import { GameTeasers } from '../components/GameTeasers'
import { FaqSection } from '../components/FaqSection'
import { Community } from '../components/Community'

/** Главная: облегчённый лендинг с обзором и тизерами игр. */
export function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <GameTeasers />
      <FaqSection />
      <Community />
    </>
  )
}
