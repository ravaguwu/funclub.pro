import { useEffect, useRef, useState } from 'react'
import { DISCORDS } from '../data/servers'

interface DiscordPickerProps {
  /** класс кнопки-триггера (btn btn--ghost для hero, nav__cta для хедера) */
  triggerClassName: string
  /** текст на кнопке */
  label: string
  /** куда выезжает меню: вниз (hero) или вверх не нужно — всегда вниз */
  align?: 'left' | 'right'
}

export function DiscordPicker({ triggerClassName, label, align = 'left' }: DiscordPickerProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="discord-picker" ref={rootRef}>
      <button
        type="button"
        className={triggerClassName}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        {label}
        <span className={`discord-picker__caret ${open ? 'is-open' : ''}`} aria-hidden="true">
          ▾
        </span>
      </button>

      {open && (
        <div className={`discord-picker__menu discord-picker__menu--${align}`} role="menu">
          <span className="discord-picker__hint">Выбери сервер</span>
          {DISCORDS.map((d) => (
            <a
              key={d.href}
              className="discord-picker__item"
              style={{ '--tint': d.tint } as React.CSSProperties}
              href={d.href}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              onClick={() => setOpen(false)}
            >
              <img className="discord-picker__logo" src={d.logo} alt="" width={34} height={34} />
              <span className="discord-picker__item-title">{d.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
