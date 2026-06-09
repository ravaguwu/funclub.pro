import { useState } from 'react'
import { FAQ } from '../data/servers'

/**
 * Подсветить упоминания Discord-каналов (#канал) — от решётки до первого пробела.
 * split с capture-группой оставляет токены в массиве; обычный текст не начинается с #.
 */
function renderAnswer(text: string) {
  return text.split(/(#\S+)/g).map((part, i) =>
    part.startsWith('#') ? (
      <span key={i} className="faq-channel">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

/** Частые вопросы — мастер-деталь: список слева, ответ в панели справа. */
export function FaqSection() {
  const [active, setActive] = useState(0)
  const current = FAQ[active]

  return (
    <section className="section faq" id="faq">
      <div className="container">
        <header className="reveal">
          <span className="eyebrow">FAQ</span>
          <h2 className="section-title">Частые вопросы</h2>
          <p className="section-lead">
            Коротко о главном. Не нашёл ответа? Тебе всегда помогут в Discord.
          </p>
        </header>

        <div className="faq-layout reveal">
          <div className="faq-questions" role="tablist" aria-label="Вопросы">
            {FAQ.map((item, i) => {
              const selected = active === i
              return (
                <button
                  type="button"
                  key={item.q}
                  className="faq-q"
                  role="tab"
                  aria-selected={selected}
                  aria-controls="faq-answer"
                  onClick={() => setActive(i)}
                >
                  <span>{item.q}</span>
                  <span className="faq-q__marker" aria-hidden="true">
                    →
                  </span>
                </button>
              )
            })}
          </div>

          <div className="faq-answer" id="faq-answer" role="tabpanel" key={active}>
            <h3 className="faq-answer__q">{current.q}</h3>
            <p className="faq-answer__a">{renderAnswer(current.a)}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
