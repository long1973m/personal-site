import { useEffect, useRef } from 'react'

/**
 * 绯樱之夜：旋转飘落的樱花瓣，双层椭圆模拟花瓣形态与光影面
 * 透明画布逐帧清除，粉色系色相在 325°~355° 间取值
 */
interface Petal {
  x: number
  y: number
  size: number
  speedY: number
  swayAmp: number
  phase: number
  rot: number
  rotSpeed: number
  hue: number
  sat: number
  light: number
}

export default function PetalsBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.innerWidth <= 768

    let raf = 0
    let petals: Petal[] = []
    let last = 0

    const spawn = (fromTop = false): Petal => ({
      x: Math.random() * canvas.width,
      y: fromTop ? -16 : Math.random() * canvas.height,
      size: 4.5 + Math.random() * 6,
      speedY: 22 + Math.random() * 40,
      swayAmp: 24 + Math.random() * 36,
      phase: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 2.4,
      hue: 325 + Math.random() * 30,
      sat: 68 + Math.random() * 18,
      light: 62 + Math.random() * 14,
    })

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const count = mobile ? 14 : 26
      petals = Array.from({ length: count }, () => spawn())
    }

    const drawPetal = (p: Petal) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      // 主瓣
      ctx.beginPath()
      ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.light}%, 0.78)`
      ctx.fill()
      // 高光内瓣（偏移制造立体感）
      ctx.beginPath()
      ctx.ellipse(-p.size * 0.22, -p.size * 0.14, p.size * 0.52, p.size * 0.3, 0, 0, Math.PI * 2)
      ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${Math.min(p.light + 16, 92)}%, 0.55)`
      ctx.fill()
      ctx.restore()
    }

    const frame = (t: number) => {
      const dt = last ? Math.min((t - last) / 1000, 0.05) : 0.016
      last = t
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i]
        p.y += p.speedY * dt
        p.rot += p.rotSpeed * dt
        p.x += Math.sin(t / 1000 * 0.7 + p.phase) * p.swayAmp * dt

        if (p.y > canvas.height + 20) petals[i] = spawn(true)
        if (p.x < -30) p.x = canvas.width + 20
        if (p.x > canvas.width + 30) p.x = -20

        drawPetal(p)
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
