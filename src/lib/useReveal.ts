import { useEffect } from 'react'

/**
 * Добавляет класс is-visible элементам .reveal при попадании во вьюпорт.
 * Передай меняющуюся зависимость (напр. pathname), чтобы наблюдатель
 * пересоздавался при смене роута и подхватывал новые элементы.
 */
export function useReveal(dep?: unknown) {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            io.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [dep])
}
