import { RotatingText } from './RotatingText'

/** Слова для ротатора в заголовке — крутятся по кругу. */
const ROTATING_WORDS = ['миров', 'эмоций', 'моментов', 'знакомств', 'раундов', 'веселья']

const STATS = [
  { value: '18K+', label: 'участников в Discord' },
  { value: '10', label: 'игровых серверов' },
  { value: '3', label: 'игры вселенной SCP' },
  { value: '24/7', label: 'серверы онлайн' },
]

export function About() {
  return (
    <section className="section about" id="about">
      <div className="container">
        <header className="reveal">
          <span className="eyebrow">О проекте</span>
          <h2 className="section-title">
            Один Фонд — море{' '}
            <RotatingText words={ROTATING_WORDS} className="grad-flow" />
          </h2>
          <p className="section-lead">
            FUNCLUB — это русскоязычное сообщество по вселенной SCP. Мы держим целый
            комплекс серверов: от хаотичных режимов без правил до серьёзного ролевого
            отыгрыша. Выбирай тот, что больше всего по вкусу и присоединяйся к игре.
          </p>
        </header>

        <div className="stats">
          {STATS.map((s) => (
            <div className="stat reveal" key={s.label}>
              <div className="stat__value grad">{s.value}</div>
              <div className="stat__label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
