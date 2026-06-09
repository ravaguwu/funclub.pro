import type { ModeCard } from '../data/servers'
import { ModeBadge } from './ModeBadge'
import { ConnectButton } from './ConnectButton'

export function ServerCard({ mode }: { mode: ModeCard }) {
  return (
    <article
      className="card reveal"
      style={{ '--mc': mode.color } as React.CSSProperties}
    >
      <span className="card__border" aria-hidden="true" />
      <div className="card__glow" aria-hidden="true" />
      <header className="card__head">
        <ModeBadge modeKey={mode.key} color={mode.color} />
        <h3 className="card__title">{mode.title}</h3>
      </header>
      <p className="card__blurb">{mode.blurb}</p>

      <div className="card__servers">
        {mode.servers.map((s) => (
          <ConnectButton key={s.label + s.ip} server={s} color={mode.color} />
        ))}
      </div>

      {(mode.rules || mode.extraLink) && (
        <div className="card__links">
          {mode.rules && (
            <a className="card__rules" href={mode.rules} target="_blank" rel="noopener noreferrer">
              Правила ↗
            </a>
          )}
          {mode.extraLink && (
            <a className="card__extra" href={mode.extraLink.href} target="_blank" rel="noopener noreferrer">
              {mode.extraLink.label} ↗
            </a>
          )}
        </div>
      )}
    </article>
  )
}
