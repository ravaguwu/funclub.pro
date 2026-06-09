import type { GameBlock } from '../data/servers'
import { ServerCard } from './ServerCard'

export function ServerSection({ block }: { block: GameBlock }) {
  return (
    <section className="section server-section" id={block.id}>
      <div className="container">
        <header className="server-section__head reveal">
          <img
            className="server-section__logo"
            src={block.logo}
            alt={`Логотип ${block.short}`}
            width={104}
            height={104}
          />
          <span className="eyebrow">{block.short}</span>
          <h2 className="section-title">{block.game}</h2>
          <p className="section-lead">{block.tagline}</p>
        </header>

        <div className="card-grid">
          {block.modes.map((mode, i) => (
            <ServerCard key={mode.title + i} mode={mode} />
          ))}
        </div>
      </div>
    </section>
  )
}
