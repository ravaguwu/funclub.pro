import { useEffect, useRef } from 'react'

/**
 * Переливающийся WebGL-фон (порт reactbits Iridescence на ogl).
 * ogl грузится динамически — отдельным чанком, только когда монтируется
 * подстраница, чтобы не тащить WebGL в бандл главной.
 */
type Props = {
  color?: [number, number, number]
  speed?: number
  amplitude?: number
  mouseReact?: boolean
  className?: string
}

const VERT = `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`

const FRAG = `
precision highp float;
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uResolution;
uniform vec2 uMouse;
uniform float uAmplitude;
uniform float uSpeed;
varying vec2 vUv;
void main() {
  float mr = min(uResolution.x, uResolution.y);
  vec2 uv = (vUv.xy * 2.0 - 1.0) * uResolution.xy / mr;
  uv += (uMouse - vec2(0.5)) * uAmplitude;
  float d = -uTime * 0.5 * uSpeed;
  float a = 0.0;
  for (float i = 0.0; i < 8.0; ++i) {
    a += cos(i - d - a * uv.x);
    d += sin(uv.y * i + a);
  }
  d += uTime * 0.5 * uSpeed;
  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);
  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;
  gl_FragColor = vec4(col, 1.0);
}
`

export function Iridescence({
  color = [1, 1, 1],
  speed = 1.0,
  amplitude = 0.1,
  mouseReact = true,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouse = useRef({ x: 0.5, y: 0.5 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let disposed = false
    let rafId = 0
    let canvas: HTMLCanvasElement | null = null
    let observer: ResizeObserver | null = null
    let onMouseMove: ((e: MouseEvent) => void) | null = null
    let loseCtx: (() => void) | null = null
    let onVisibility: (() => void) | null = null
    let io: IntersectionObserver | null = null

    // на мобилках держим DPR=1: фон размыт и под маской, разница не видна,
    // но фрагментной работы GPU кратно меньше (на retina — вчетверо)
    const isMobile =
      window.matchMedia('(max-width: 760px)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    const dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 2)

    import('ogl')
      .then(({ Renderer, Program, Mesh, Color, Triangle }) => {
        if (disposed || !container) return

        const renderer = new Renderer({
          alpha: true,
          antialias: false,
          dpr,
        })
        const gl = renderer.gl
        gl.clearColor(0, 0, 0, 0)

        const w = container.offsetWidth || 1
        const h = container.offsetHeight || 1

        const geometry = new Triangle(gl)
        const program = new Program(gl, {
          vertex: VERT,
          fragment: FRAG,
          uniforms: {
            uTime: { value: 0 },
            uColor: { value: new Color(...color) },
            uResolution: { value: new Color(w, h, w / h) },
            uMouse: { value: new Float32Array([mouse.current.x, mouse.current.y]) },
            uAmplitude: { value: amplitude },
            uSpeed: { value: speed },
          },
        })
        const mesh = new Mesh(gl, { geometry, program })

        const resize = () => {
          const nw = container.offsetWidth || 1
          const nh = container.offsetHeight || 1
          renderer.setSize(nw, nh)
          program.uniforms.uResolution.value = new Color(nw, nh, nw / nh)
        }
        resize()
        observer = new ResizeObserver(resize)
        observer.observe(container)

        if (mouseReact) {
          onMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect()
            mouse.current.x = (e.clientX - rect.left) / rect.width
            mouse.current.y = 1 - (e.clientY - rect.top) / rect.height
            program.uniforms.uMouse.value[0] = mouse.current.x
            program.uniforms.uMouse.value[1] = mouse.current.y
          }
          container.addEventListener('mousemove', onMouseMove)
        }

        canvas = gl.canvas
        canvas.style.width = '100%'
        canvas.style.height = '100%'
        canvas.style.display = 'block'
        container.appendChild(canvas)

        const ext = gl.getExtension('WEBGL_lose_context')
        loseCtx = ext ? () => ext.loseContext() : null

        if (reduced) {
          program.uniforms.uTime.value = 6
          renderer.render({ scene: mesh })
          return
        }

        // крутим шейдер только когда вкладка активна И фон в зоне видимости —
        // иначе на слабых устройствах это лишний нагрев и жор батареи впустую
        let onScreen = true
        let pageVisible = !document.hidden

        const update = (t: number) => {
          program.uniforms.uTime.value = t * 0.001
          renderer.render({ scene: mesh })
          rafId = requestAnimationFrame(update)
        }
        const start = () => {
          if (!rafId && onScreen && pageVisible) rafId = requestAnimationFrame(update)
        }
        const stop = () => {
          if (rafId) {
            cancelAnimationFrame(rafId)
            rafId = 0
          }
        }

        onVisibility = () => {
          pageVisible = !document.hidden
          if (pageVisible) start()
          else stop()
        }
        document.addEventListener('visibilitychange', onVisibility)

        io = new IntersectionObserver((entries) => {
          onScreen = entries[0]?.isIntersecting ?? true
          if (onScreen) start()
          else stop()
        })
        io.observe(container)

        start()
      })
      .catch(() => {
        // WebGL/ogl недоступны — остаётся CSS-фон под канвой
      })

    return () => {
      disposed = true
      if (rafId) cancelAnimationFrame(rafId)
      if (observer) observer.disconnect()
      if (io) io.disconnect()
      if (onVisibility) document.removeEventListener('visibilitychange', onVisibility)
      if (onMouseMove && container) container.removeEventListener('mousemove', onMouseMove)
      if (loseCtx) loseCtx()
      if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas)
    }
  }, [color, speed, amplitude, mouseReact])

  return <div ref={containerRef} className={className} aria-hidden="true" />
}
