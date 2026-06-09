import { useEffect, useRef, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'

/** Пункт пилюль-навигации. */
export interface PillItem {
  href: string
  label: string
  logo?: string
  ariaLabel?: string
  /** акцент заливки при наведении (CSS-переменная --base) */
  tint?: string
}

interface PillNavProps {
  logo: string
  logoAlt?: string
  logoHref?: string
  items: PillItem[]
  activeHref?: string
  scrolled?: boolean
  /** десктоп: блок справа от пилюль (донат, Discord-пикер) */
  rightSlot?: ReactNode
  /** мобильный поповер: доп. ссылки под основными */
  mobileExtra?: ReactNode
  ease?: string
}

const isExternal = (href: string) =>
  /^(https?:)?\/\//.test(href) || /^(mailto:|tel:|#)/.test(href)

export function PillNav({
  logo,
  logoAlt = 'Logo',
  logoHref = '/',
  items,
  activeHref,
  scrolled = false,
  rightSlot,
  mobileExtra,
  ease = 'power3.out',
}: PillNavProps) {
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([])
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([])
  const tweenRefs = useRef<Array<gsap.core.Tween | null>>([])
  const logoImgRef = useRef<HTMLImageElement>(null)
  const navItemsRef = useRef<HTMLDivElement>(null)
  const burgerRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const openRef = useRef(false)

  // Геометрия hover-кругов + таймлайны заливки пилюль
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const layout = () => {
      circleRefs.current.forEach((circle, i) => {
        const pill = circle?.parentElement as HTMLElement | null
        if (!circle || !pill) return
        const { width: w, height: h } = pill.getBoundingClientRect()
        const R = ((w * w) / 4 + h * h) ** 0.5
        const D = Math.ceil(2 * R) + 2
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1
        const originY = D - delta

        circle.style.width = `${D}px`
        circle.style.height = `${D}px`
        circle.style.bottom = `-${delta}px`
        gsap.set(circle, { xPercent: -50, scale: 0, transformOrigin: `50% ${originY}px` })

        const label = pill.querySelector<HTMLElement>('.pill-label')
        const hover = pill.querySelector<HTMLElement>('.pill-label-hover')
        if (label) gsap.set(label, { y: 0 })
        if (hover) gsap.set(hover, { y: h + 12, opacity: 0 })

        tlRefs.current[i]?.kill()
        const tl = gsap.timeline({ paused: true })
        tl.to(circle, { scale: 1.2, duration: 2, ease, overwrite: 'auto' }, 0)
        if (label) tl.to(label, { y: -(h + 8), duration: 2, ease, overwrite: 'auto' }, 0)
        if (hover) tl.to(hover, { y: 0, opacity: 1, duration: 2, ease, overwrite: 'auto' }, 0)
        tlRefs.current[i] = tl
      })
    }

    layout()
    window.addEventListener('resize', layout)
    if (document.fonts?.ready) document.fonts.ready.then(layout).catch(() => {})

    // Появление при загрузке
    if (!reduced) {
      if (logoImgRef.current) {
        gsap.fromTo(logoImgRef.current, { scale: 0 }, { scale: 1, duration: 0.6, ease })
      }
      if (navItemsRef.current) {
        gsap.fromTo(navItemsRef.current, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.6, ease })
      }
    }

    return () => {
      window.removeEventListener('resize', layout)
      tlRefs.current.forEach((tl) => tl?.kill())
      tweenRefs.current.forEach((tw) => tw?.kill())
    }
  }, [ease, items.length])

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i]
    if (!tl) return
    tweenRefs.current[i]?.kill()
    tweenRefs.current[i] = tl.tweenTo(tl.duration(), { duration: 0.3, ease, overwrite: 'auto' })
  }
  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i]
    if (!tl) return
    tweenRefs.current[i]?.kill()
    tweenRefs.current[i] = tl.tweenTo(0, { duration: 0.2, ease, overwrite: 'auto' })
  }

  const handleLogoEnter = () => {
    const img = logoImgRef.current
    if (!img) return
    gsap.fromTo(img, { rotate: 0 }, { rotate: 360, duration: 0.5, ease })
  }

  const toggleMobile = () => {
    const next = !openRef.current
    openRef.current = next
    const pop = popoverRef.current
    const burger = burgerRef.current
    if (burger) {
      const [l1, l2] = burger.querySelectorAll<HTMLElement>('.pillnav__line')
      if (next) {
        gsap.to(l1, { rotate: 45, y: 3, duration: 0.3, ease })
        gsap.to(l2, { rotate: -45, y: -3, duration: 0.3, ease })
      } else {
        gsap.to(l1, { rotate: 0, y: 0, duration: 0.3, ease })
        gsap.to(l2, { rotate: 0, y: 0, duration: 0.3, ease })
      }
      burger.setAttribute('aria-expanded', String(next))
    }
    if (!pop) return
    if (next) {
      pop.style.visibility = 'visible'
      gsap.fromTo(pop, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease })
    } else {
      gsap.to(pop, {
        opacity: 0,
        y: 10,
        duration: 0.2,
        ease,
        onComplete: () => {
          if (pop) pop.style.visibility = 'hidden'
        },
      })
    }
  }

  const closeMobile = () => {
    if (openRef.current) toggleMobile()
  }

  const renderPill = (item: PillItem, i: number) => {
    const active = activeHref === item.href
    const inner = (
      <>
        <span className="hover-circle" aria-hidden="true" ref={(el) => (circleRefs.current[i] = el)} />
        {item.logo && <img className="pill-icon" src={item.logo} alt="" width={20} height={20} />}
        <span className="label-stack">
          <span className="pill-label">{item.label}</span>
          <span className="pill-label-hover" aria-hidden="true">
            {item.label}
          </span>
        </span>
      </>
    )
    const cls = `pill ${active ? 'is-active' : ''}`
    const common = {
      className: cls,
      style: item.tint ? ({ '--base': item.tint } as React.CSSProperties) : undefined,
      onMouseEnter: () => handleEnter(i),
      onMouseLeave: () => handleLeave(i),
      'aria-label': item.ariaLabel || item.label,
    }
    return (
      <li key={item.href} role="none">
        {isExternal(item.href) ? (
          <a {...common} href={item.href} target="_blank" rel="noopener noreferrer" role="menuitem">
            {inner}
          </a>
        ) : (
          <Link {...common} to={item.href} role="menuitem">
            {inner}
          </Link>
        )}
      </li>
    )
  }

  return (
    <header className={`pillnav ${scrolled ? 'pillnav--scrolled' : ''}`}>
      <div className="container pillnav__inner">
        <Link className="pill-logo" to={logoHref} onMouseEnter={handleLogoEnter} aria-label={logoAlt}>
          <img ref={logoImgRef} src={logo} alt={logoAlt} width={36} height={36} />
          <span className="pill-logo__text">FUNCLUB</span>
        </Link>

        <div className="pill-nav-items desktop-only" ref={navItemsRef}>
          <ul className="pill-list" role="menubar">
            {items.map(renderPill)}
          </ul>
          {rightSlot && <div className="pillnav__right">{rightSlot}</div>}
        </div>

        <button
          ref={burgerRef}
          className="pillnav__burger mobile-only"
          onClick={toggleMobile}
          aria-label="Меню"
          aria-expanded={false}
        >
          <span className="pillnav__line" />
          <span className="pillnav__line" />
        </button>
      </div>

      <div ref={popoverRef} className="mobile-menu-popover mobile-only" role="menu">
        <ul className="mobile-menu-list">
          {items.map((item) => (
            <li key={item.href}>
              {isExternal(item.href) ? (
                <a
                  className="mobile-menu-link"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobile}
                >
                  {item.logo && <img src={item.logo} alt="" width={22} height={22} />}
                  {item.label}
                </a>
              ) : (
                <Link className="mobile-menu-link" to={item.href} onClick={closeMobile}>
                  {item.logo && <img src={item.logo} alt="" width={22} height={22} />}
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
        {mobileExtra && <div className="mobile-menu-extra">{mobileExtra}</div>}
      </div>
    </header>
  )
}
