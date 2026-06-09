import { useEffect, useRef } from 'react'
import { StarfieldBg } from './StarfieldBg'
import { DiscordPicker } from './DiscordPicker'

export function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // лёгкая анимация появления через GSAP, импорт по требованию
    let cancelled = false
    import('gsap').then(({ gsap }) => {
      if (cancelled || !titleRef.current) return
      gsap.from(titleRef.current, {
        y: 40,
        opacity: 0,
        duration: 1.1,
        ease: 'power3.out',
      })
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section className="hero" id="top">
      <div className="hero__bg" aria-hidden="true" />
      <div className="hero__tint" aria-hidden="true" />
      <StarfieldBg />
      <div className="hero__readbar" aria-hidden="true" />

      <div className="container hero__content">
        <img className="hero__logo" src="/logo.png" alt="" width={96} height={96} />
        <p className="hero__kicker">Лучшее сообщество в этой вселенной</p>
        <h1 ref={titleRef} className="hero__title grad-flow">
          FUNCLUB
        </h1>
        <p className="hero__sub">
          Комплекс игровых серверов SCP: Secret Laboratory и Containment Breach.
          Десятки режимов — от полного беспредела до глубокого ролевого отыгрыша.
        </p>
        <div className="hero__cta">
          <a className="btn btn--primary" href="#games">
            Выбрать сервер
          </a>
          <DiscordPicker triggerClassName="btn btn--ghost" label="Зайти в Discord" />
        </div>
      </div>

      <a className="hero__scroll" href="#about" aria-label="Листать вниз">
        <span />
      </a>
    </section>
  )
}
