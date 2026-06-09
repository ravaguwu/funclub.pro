import { SOCIALS, type SocialLink } from '../data/servers'
import { BrandIcon } from './BrandIcon'

const GROUPS: { key: SocialLink['group']; title: string; hint: string }[] = [
  { key: 'discord', title: 'Discord', hint: 'Основное общение и новости' },
  { key: 'telegram', title: 'Telegram', hint: 'Каналы проектов' },
  { key: 'stream', title: 'Стримы и видео', hint: 'Twitch и YouTube' },
  { key: 'donate', title: 'Поддержать', hint: 'Помощь проекту' },
]

export function Community() {
  return (
    <section className="section community" id="community">
      <div className="container">
        <header className="reveal">
          <span className="eyebrow">Сообщество</span>
          <h2 className="section-title">Где нас найти</h2>
          <p className="section-lead">
            Общайся в Discord и Telegram, смотри стримы или поддержи проект — мы рады каждому.
          </p>
        </header>

        <div className="community-grid">
          {GROUPS.map((g) => {
            const items = SOCIALS.filter((s) => s.group === g.key)
            return (
              <div className={`comm-card comm-card--${g.key} reveal`} key={g.key}>
                <h3 className="comm-card__title">{g.title}</h3>
                <p className="comm-card__hint">{g.hint}</p>
                <div className="comm-card__links">
                  {items.map((s) => (
                    <a
                      key={s.href}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="comm-link"
                    >
                      <BrandIcon name={s.icon} />
                      <span className="comm-link__label">{s.label}</span>
                      <span className="comm-link__arrow" aria-hidden="true">
                        ↗
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
