import { useEffect, useRef } from 'react'

/**
 * Живой слой звёзд поверх фоновой картинки: 3 слоя глубины, мерцание,
 * лёгкий parallax по мыши, медленный дрейф. Уважает prefers-reduced-motion.
 */
export function StarfieldBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const DPR = Math.min(window.devicePixelRatio || 1, 2)
    let W = 0
    let H = 0
    let raf = 0
    let last = performance.now()
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 }

    interface Star {
      x: number
      y: number
      r: number
      base: number
      tw: number
      tws: number
      warm: boolean
    }
    let layers: { depth: number; stars: Star[] }[] = []

    const rand = (a: number, b: number) => a + Math.random() * (b - a)

    function build() {
      const baseN = (W * H) / 9000
      layers = [
        { depth: 0.3, stars: [] },
        { depth: 0.6, stars: [] },
        { depth: 1.0, stars: [] },
      ]
      const split = [0.5, 0.32, 0.18]
      layers.forEach((L, i) => {
        const n = Math.floor(baseN * split[i])
        for (let k = 0; k < n; k++) {
          L.stars.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: rand(0.3, 1.5) * (0.6 + L.depth),
            base: rand(0.3, 1) * (0.5 + L.depth * 0.5),
            tw: Math.random() * Math.PI * 2,
            tws: rand(0.4, 1.2),
            warm: Math.random() < 0.18,
          })
        }
      })
    }

    function resize() {
      W = canvas!.width = Math.floor(window.innerWidth * DPR)
      H = canvas!.height = Math.floor(window.innerHeight * DPR)
      build()
    }

    function frame(now: number) {
      let dt = now - last
      last = now
      if (dt > 60) dt = 60
      mouse.tx += (mouse.x - mouse.tx) * 0.05
      mouse.ty += (mouse.y - mouse.ty) * 0.05

      ctx!.clearRect(0, 0, W, H)
      for (const L of layers) {
        const par = 1.1 * (0.4 + L.depth)
        const px = mouse.tx * 26 * DPR * par
        const py = mouse.ty * 26 * DPR * par
        const dx = reduced ? 0 : 0.12 * L.depth * dt
        for (const s of L.stars) {
          if (!reduced) {
            s.x -= dx
            if (s.x < -4) {
              s.x = W + 4
              s.y = Math.random() * H
            }
            s.tw += dt * 0.004 * s.tws
          }
          const flick = reduced ? 1 : 0.6 + Math.sin(s.tw) * 0.4
          const a = Math.max(0, Math.min(1, s.base * flick))
          ctx!.globalAlpha = a * 0.92
          if (s.r > 1.05) {
            ctx!.shadowBlur = 6
            ctx!.shadowColor = s.warm ? '#ffd9a0' : '#bcd0ff'
          } else {
            ctx!.shadowBlur = 0
          }
          ctx!.fillStyle = s.warm ? '#fff0d8' : '#eaf0ff'
          ctx!.beginPath()
          ctx!.arc(s.x + px, s.y + py, s.r * DPR, 0, 7)
          ctx!.fill()
        }
      }
      ctx!.shadowBlur = 0
      ctx!.globalAlpha = 1
      raf = requestAnimationFrame(frame)
    }

    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />
}
