import { Link } from 'react-router-dom'
import { GAME_BLOCKS } from '../data/servers'

/** Акцент обводки тизера под цвет игры (совпадает с пилюлями навбара/пикером). */
const TEASER_TINT: Record<string, string> = {
  scpsl: '#20a8e8',
  scpcbm: '#f4003d',
}

/** Два тизера игр на главной — ведут на детальные подстраницы. */
export function GameTeasers() {
  return (
    <section className="section teasers-section" id="games">
      <div className="container">
        <header className="server-section__head reveal">
          <span className="eyebrow">Игры</span>
          <h2 className="section-title">Выбери, во что играть</h2>
          <p className="section-lead">
            Два мира вселенной SCP, у каждого — свои режимы от мягкого RP до полного хардкора.
          </p>
        </header>

        <div className="teasers">
          {GAME_BLOCKS.map((block) => (
            <Link
              key={block.id}
              className="teaser reveal"
              to={block.path}
              style={{ '--tint': TEASER_TINT[block.id] ?? 'var(--teal)' } as React.CSSProperties}
            >
              <img
                className="teaser__logo"
                src={block.logo}
                alt={`Логотип ${block.short}`}
                width={56}
                height={56}
              />
              <span className="teaser__eyebrow">{block.short}</span>
              <h3 className="teaser__title">{block.game}</h3>
              <p className="teaser__blurb">{block.tagline}</p>
              <span className="teaser__meta">{block.modes.length} режимов</span>
              <span className="teaser__cta">Подробнее →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
