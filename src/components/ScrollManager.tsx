import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Управляет скроллом при навигации:
 * - есть hash (#about) → доскроллить к элементу
 * - иначе → наверх страницы
 */
export function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0 })
  }, [pathname, hash])

  return null
}
