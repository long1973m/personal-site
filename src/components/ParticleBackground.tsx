import { useEffect, useRef, useState } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  hue: number
  phase: number
  twinkleSpeed: number
}

interface Comet {
  x: number
  y: number
  angle: number
  speed: number
  life: number
  maxLife: number
  hue: number
}

interface ParticleBackgroundProps {
  density?: number              // 粒子密度倍率（背景风格系统用）
  hue?: 'default' | 'cyan' | 'warm' | 'rose'   // 星点色相
}

export default function ParticleBackground({ density = 1, hue = 'default' }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const mouseRef = useRef<{ x: number; y: number } | null>(null)
  const lastMouseUpdate = useRef(0)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let particles: Particle[] = []
    let comets: Comet[] = []
    let isPaused = false
    let lastTime = 0
    let timeSinceComet = 0
    let nextCometGap = 2.5 + Math.random() * 4
    let curveTime = 0
    let curveControlPoints = Array.from({ length: 3 }, () => ({
      x1: Math.random() * canvas.width,
      y1: Math.random() * canvas.height,
      x2: Math.random() * canvas.width,
      y2: Math.random() * canvas.height,
      x3: Math.random() * canvas.width,
      y3: Math.random() * canvas.height,
    }))

    // Mouse tracking with throttle (30ms)
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastMouseUpdate.current < 30) return
      lastMouseUpdate.current = now
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleMouseLeave = () => {
      mouseRef.current = null
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      // Mobile: fewer particles, desktop: more particles；density 由背景风格系统调节
      const maxParticles = Math.round((isMobile ? 30 : 80) * density)
      const count = Math.min(maxParticles, Math.floor((canvas.width * canvas.height) / (isMobile ? 25000 : 15000)))

      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (isMobile ? 3 : 4) + (isMobile ? 1 : 2),
        // Mobile: slower, simpler movement
        speedX: (Math.random() - 0.5) * (isMobile ? 0.15 : 0.3),
        speedY: (Math.random() - 0.5) * (isMobile ? 0.15 : 0.3),
        opacity: Math.random() * 0.5 + 0.2,
        // default: 蓝→紫→粉 / cyan: 青蓝 / warm: 洋红→橙金（合成波）/ rose: 粉玫瑰（绯樱）
        hue:
          hue === 'cyan' ? Math.random() * 60 + 175
          : hue === 'warm' ? Math.random() * 75 + 315
          : hue === 'rose' ? Math.random() * 35 + 325
          : Math.random() * 100 + 230,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.5 + Math.random() * 1.5,
      }))
    }

    const drawParticle = (p: Particle, t: number) => {
      // 星星闪烁：正弦调制透明度
      const twinkle = 0.65 + 0.35 * Math.sin(t * p.twinkleSpeed + p.phase)
      const alpha = p.opacity * twinkle

      ctx.beginPath()
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2)
      gradient.addColorStop(0, `hsla(${p.hue}, 75%, 65%, ${alpha})`)
      gradient.addColorStop(1, `hsla(${p.hue}, 75%, 65%, 0)`)
      ctx.fillStyle = gradient
      ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
      ctx.fill()
    }

    const drawConnections = () => {
      const maxDistance = isMobile ? 80 : 120

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.3
            const avgHue = (particles[i].hue + particles[j].hue) / 2

            ctx.beginPath()
            ctx.strokeStyle = `hsla(${avgHue}, 60%, 50%, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }
    }

    const drawCurves = () => {
      if (isMobile) return

      curveTime += 0.002
      curveControlPoints = curveControlPoints.map(cp => ({
        x1: cp.x1 + Math.sin(curveTime + cp.x1 * 0.01) * 0.3,
        y1: cp.y1 + Math.cos(curveTime + cp.y1 * 0.01) * 0.3,
        x2: cp.x2 + Math.sin(curveTime * 0.8 + cp.x2 * 0.01) * 0.3,
        y2: cp.y2 + Math.cos(curveTime * 0.8 + cp.y2 * 0.01) * 0.3,
        x3: cp.x3 + Math.sin(curveTime * 1.2 + cp.x3 * 0.01) * 0.3,
        y3: cp.y3 + Math.cos(curveTime * 1.2 + cp.y3 * 0.01) * 0.3,
      }))

      ctx.lineWidth = 1.5

      curveControlPoints.forEach(cp => {
        ctx.beginPath()
        ctx.moveTo(cp.x1, cp.y1)
        ctx.quadraticCurveTo(cp.x2, cp.y2, cp.x3, cp.y3)
        ctx.strokeStyle = `hsla(180, 60%, 50%, 0.04)`
        ctx.stroke()
      })
    }

    const spawnComet = () => {
      const fromLeft = Math.random() > 0.5
      const deg = (20 + Math.random() * 25) * (Math.PI / 180)
      comets.push({
        x: Math.random() * canvas.width * 0.8 + canvas.width * 0.1,
        y: -30,
        angle: fromLeft ? deg : Math.PI - deg,
        speed: 380 + Math.random() * 260,
        life: 0,
        maxLife: 1.4 + Math.random() * 0.8,
        hue: Math.random() > 0.5 ? 187 : 265,
      })
    }

    const drawComet = (c: Comet) => {
      const progress = c.life / c.maxLife
      const alpha = Math.sin(Math.PI * progress) * 0.8
      const tailLen = 110
      const tx = c.x - Math.cos(c.angle) * tailLen
      const ty = c.y - Math.sin(c.angle) * tailLen

      // 彗尾
      const grad = ctx.createLinearGradient(c.x, c.y, tx, ty)
      grad.addColorStop(0, `hsla(${c.hue}, 90%, 80%, ${alpha})`)
      grad.addColorStop(1, 'hsla(220, 90%, 70%, 0)')
      ctx.strokeStyle = grad
      ctx.lineWidth = 1.6
      ctx.beginPath()
      ctx.moveTo(c.x, c.y)
      ctx.lineTo(tx, ty)
      ctx.stroke()

      // 头部光点
      ctx.beginPath()
      const head = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 6)
      head.addColorStop(0, `hsla(${c.hue}, 95%, 88%, ${alpha})`)
      head.addColorStop(1, `hsla(${c.hue}, 95%, 88%, 0)`)
      ctx.fillStyle = head
      ctx.arc(c.x, c.y, 6, 0, Math.PI * 2)
      ctx.fill()
    }

    const updateParticle = (p: Particle) => {
      // Cursor repulsion (desktop only)
      if (mouseRef.current && !isMobile) {
        const dx = p.x - mouseRef.current.x
        const dy = p.y - mouseRef.current.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const radius = 100

        if (distance < radius && distance > 0) {
          const force = (1 - distance / radius) * 0.5
          p.speedX += (dx / distance) * force
          p.speedY += (dy / distance) * force
        }
      }

      // Damping to prevent speed buildup
      p.speedX *= 0.99
      p.speedY *= 0.99

      p.x += p.speedX
      p.y += p.speedY

      if (p.x < 0) p.x = canvas.width
      if (p.x > canvas.width) p.x = 0
      if (p.y < 0) p.y = canvas.height
      if (p.y > canvas.height) p.y = 0
    }

    const animate = (timestamp: number) => {
      const dt = lastTime ? Math.min((timestamp - lastTime) / 1000, 0.05) : 0.016
      lastTime = timestamp

      if (isPaused) {
        animationId = requestAnimationFrame(animate)
        return
      }

      ctx.fillStyle = 'rgba(10, 10, 26, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const t = timestamp / 1000

      particles.forEach(p => {
        updateParticle(p)
        drawParticle(p, t)
      })

      drawConnections()
      drawCurves()

      // 流星：桌面端随机间隔生成
      if (!isMobile) {
        timeSinceComet += dt
        if (timeSinceComet > nextCometGap) {
          spawnComet()
          timeSinceComet = 0
          nextCometGap = 4 + Math.random() * 6
        }
      }

      comets = comets.filter(c => c.life < c.maxLife && c.y < canvas.height + 80)
      comets.forEach(c => {
        c.life += dt
        c.x += Math.cos(c.angle) * c.speed * dt
        c.y += Math.sin(c.angle) * c.speed * dt
        drawComet(c)
      })

      animationId = requestAnimationFrame(animate)
    }

    // Page Visibility API: pause when tab is hidden
    const handleVisibilityChange = () => {
      isPaused = document.hidden
    }

    resize()
    animationId = requestAnimationFrame(animate)

    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isMobile, density, hue])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
