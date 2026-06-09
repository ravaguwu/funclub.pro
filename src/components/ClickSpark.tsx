import { useEffect, useRef } from 'react'

/**
 * Искры по клику в любом месте (порт reactbits ClickSpark).
 * Один canvas-оверлей на весь вьюпорт, pointer-events: none — не мешает кликам.
 */
type Props = {
  color?: string
  size?: number
  radius?: number
  count?: number
  duration?: number
}

type Spark = { x: number; y: number; angle: number; start: number }

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

export function ClickSpark({
  color = '#00fcc1',
  size = 11,
  radius = 18,
  count = 8,
  duration = 420,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sparks = useRef<Spark[]>([])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const onClick = (e: MouseEvent) => {
      const now = performance.now()
      for (let i = 0; i < count; i++) {
        sparks.current.push({
          x: e.clientX,
          y: e.clientY,
          angle: (2 * Math.PI * i) / count,
          start: now,
        })
      }
      if (!rafId) rafId = requestAnimationFrame(draw)
    }

    const draw = (now: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.lineCap = 'round'

      sparks.current = sparks.current.filter((s) => {
        const t = (now - s.start) / duration
        if (t >= 1) return false
        const eased = easeOut(t)
        const dist = radius * eased
        const len = size * (1 - eased)
        const x1 = s.x + Math.cos(s.angle) * dist
        const y1 = s.y + Math.sin(s.angle) * dist
        const x2 = s.x + Math.cos(s.angle) * (dist + len)
        const y2 = s.y + Math.sin(s.angle) * (dist + len)
        ctx.globalAlpha = 1 - eased
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
        return true
      })
      ctx.globalAlpha = 1

      if (sparks.current.length > 0) {
        rafId = requestAnimationFrame(draw)
      } else {
        rafId = 0
      }
    }

    window.addEventListener('click', onClick)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('click', onClick)
      if (rafId) cancelAnimationFrame(rafId)
      sparks.current = []
    }
  }, [color, size, radius, count, duration])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  )
}
