import { useEffect, useRef } from 'react'

/**
 * 极夜飘雪：带景深的雪花（近大远小、近快远慢），正弦横漂模拟风
 * 透明画布逐帧清除；偶发大朵虚化近景雪增强空间感
 */
interface Flake {
  x: number
  y: number
  r: number
  speedY: number
  swayAmp: number
  phase: number
  alpha: number
}

export default function Snowfall() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.innerWidth <= 768

    let raf = 0
    let flakes: Flake[] = []
    let last = 0

    // depth: 0(远景) → 1(近景)
    const spawn = (fromTop = false): Flake => {
      const depth = Math.random()
      return {
        x: Math.random() * canvas.width,
        y: fromTop ? -8 : Math.random() * canvas.height,
        r: 0.9 + depth * (mobile ? 2.2 : 3.1),
        speedY: 14 + depth * 52,
        swayAmp: 10 + depth * 26,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.28 + depth * 0.6,
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const count = mobile ? 46 : 110
      flakes = Array.from({ length: count }, () => spawn())
    }

    const frame = (t: number) => {
      const dt = last ? Math.min((t - last) / 1000, 0.05) : 0.016
      last = t
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i]
        f.y += f.speedY * dt
        if (f.y > canvas.height + 6) {
          flakes[i] = spawn(true)
          continue
        }
        const sway = Math.sin(t / 1000 * 0.5 + f.phase) * f.swayAmp * dt

        ctx.beginPath()
        ctx.arc(f.x + sway, f.y, f.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(226, 240, 255, ${f.alpha})`
        ctx.fill()
      }
      raf = requestAnimationFrame(frame)
    }

    resize()
    if (reduced) {
      frame(0)
      cancelAnimationFrame(raf)
    } else {
      raf = requestAnimationFrame(frame)
    }

    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
