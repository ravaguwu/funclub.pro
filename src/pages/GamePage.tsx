import { Link } from 'react-router-dom'
import type { GameBlock } from '../data/servers'
import { ServerSection } from '../components/ServerSection'
import { Iridescence } from '../components/Iridescence'

/** Тон переливающегося фона под каждую игру (RGB 0..1). */
const AURA_COLOR: Record<string, [number, number, number]> = {
  scpsl: [0.12, 0.95, 0.78],
  scpcbm: [0.96, 0.26, 0.36],
}

/** Детальная страница одной игры: список режимов + навигация. */
export function GamePage({ block }: { block: GameBlock }) {
  const auraColor = AURA_COLOR[block.id] ?? [0.4, 0.6, 1]
  return (
    <div className={`game-page game-page--${block.id}`}>
      <div className="game-page__aura" aria-hidden="true">
        <Iridescence className="game-page__iridescence" color={auraColor} speed={0.6} amplitude={0.12} />
      </div>
      <div className="container">
        <Link className="game-page__back" to="/">
          ← На главную
        </Link>
      </div>

      <ServerSection block={block} />

      <div className="container game-page__foot">
        <a
          className="btn btn--primary"
          href={block.discord}
          target="_blank"
          rel="noopener noreferrer"
        >
          Зайти в Discord {block.short}
        </a>
      </div>
    </div>
  )
}
