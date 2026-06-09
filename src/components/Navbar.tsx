import { useEffect, useState } from 'react'
import { PillNav, type PillItem } from './PillNav'
import { DiscordPicker } from './DiscordPicker'
import { useLocation } from 'react-router-dom'
import { DONATE_URL, SCP_SL, SCP_CBM } from '../data/servers'

const ITEMS: PillItem[] = [
  { href: '/#about', label: 'О проекте', tint: '#00fcc1' },
  { href: '/sl', label: 'SCP:SL', logo: SCP_SL.logo, tint: '#20a8e8' },
  { href: '/cbm', label: 'CBM / CB2', logo: SCP_CBM.logo, tint: '#f4003d' },
  { href: '/#faq', label: 'FAQ', tint: '#b46cff' },
  { href: '/#community', label: 'Сообщество', tint: '#ff8c00' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const donate = (
    <a className="pill pill--fill pill--gold" href={DONATE_URL} target="_blank" rel="noopener noreferrer">
      <span>Донат</span>
    </a>
  )

  return (
    <PillNav
      logo="/logo.png"
      logoAlt="FUNCLUB"
      items={ITEMS}
      activeHref={pathname}
      scrolled={scrolled}
      rightSlot={
        <>
          {donate}
          <DiscordPicker triggerClassName="pill pill--cta" label="Discord" align="right" />
        </>
      }
      mobileExtra={
        <>
          {donate}
          <DiscordPicker triggerClassName="pill pill--cta" label="Discord" align="left" />
        </>
      }
    />
  )
}
