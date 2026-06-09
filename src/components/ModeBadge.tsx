import type { ModeKey } from '../data/servers'

// hell переиспользует логотип No Rules
const BADGE_SRC: Record<ModeKey, string> = {
  minigames: '/modes/minigames.png',
  norules: '/modes/norules.png',
  lightrp: '/modes/lightrp.png',
  mediumrp: '/modes/mediumrp.png',
  hardrp: '/modes/hardrp.png',
  softrp: '/modes/softrp.png',
  hell: '/modes/norules.png',
}

export function ModeBadge({
  modeKey,
  color,
  size = 56,
}: {
  modeKey: ModeKey
  color: string
  size?: number
}) {
  return (
    <img
      src={BADGE_SRC[modeKey]}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      loading="lazy"
      style={{ filter: `drop-shadow(0 0 10px ${color}55)` }}
    />
  )
}
