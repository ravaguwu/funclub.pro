import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

interface RotatingTextProps {
  /** Слова, по которым крутимся по кругу. */
  words: string[]
  /** Пауза между сменами, мс. */
  interval?: number
  /** Класс для самого слова (напр. grad-flow под градиент). */
  className?: string
}

/**
 * Сменяющиеся слова: текущее уезжает вверх, новое въезжает снизу (GSAP).
 * Ширина обёртки морфится под слово. Все слова стопкой в одной grid-ячейке,
 * поэтому DOM не дёргается — анимируем только transform/opacity/filter.
 */
export function RotatingText({ words, interval = 2200, className }: RotatingTextProps) {
  const [index, setIndex] = useState(0)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([])
  const prevIndex = useRef(0)
  const mounted = useRef(false)

  useEffect(() => {
    if (words.length < 2) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return // не крутим, если человек просил меньше движения
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length)
    }, interval)
    return () => clearInterval(id)
  }, [words.length, interval])

  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const active = itemRefs.current[index]
    if (!wrap || !active) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // ширина обёртки подгоняется под активное слово
    gsap.to(wrap, {
      width: active.offsetWidth,
      duration: reduced || !mounted.current ? 0 : 0.5,
      ease: 'power3.out',
    })

    // первый рендер — просто показать слово, без вылета на загрузке страницы
    if (!mounted.current || reduced) {
      itemRefs.current.forEach((el, i) =>
        el && gsap.set(el, { opacity: i === index ? 1 : 0, yPercent: 0, filter: 'blur(0px)' }),
      )
      mounted.current = true
      prevIndex.current = index
      return
    }

    const outgoing = itemRefs.current[prevIndex.current]
    // последовательно: старое уезжает вверх, новое въезжает снизу с задержкой,
    // чтобы слова не накладывались и не было ощущения «выталкивания»
    const tl = gsap.timeline()
    if (outgoing && outgoing !== active) {
      tl.to(
        outgoing,
        { yPercent: -130, opacity: 0, filter: 'blur(4px)', duration: 0.34, ease: 'power2.in' },
        0,
      )
    }
    tl.fromTo(
      active,
      { yPercent: 130, opacity: 0, filter: 'blur(4px)' },
      { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.46, ease: 'power3.out' },
      0.3,
    )
    prevIndex.current = index
  }, [index])

  return (
    <span ref={wrapRef} className="rotating-text" aria-label={words[0]}>
      {words.map((word, i) => (
        <span
          key={word}
          ref={(el) => {
            itemRefs.current[i] = el
          }}
          className={className}
          aria-hidden="true"
        >
          {word}
        </span>
      ))}
    </span>
  )
}
