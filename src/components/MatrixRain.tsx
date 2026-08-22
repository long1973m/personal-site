import { useEffect, useRef } from 'react'

/**
 * 数字雨（黑客帝国）：绿色字符瀑布，拖尾由半透明底色累积形成
 * 桌面端约 30fps 的节流刷新，还原原版质感并省电
 */
const GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789<>*+-=|'

interface Drop {
  x: number
  y: number
  speed: number
}

export default function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.innerWidth <= 768
    const fontSize = mobile ? 16 : 15

    let raf = 0
    let drops: Drop[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      const cols = Math.ceil(canvas.width / fontSize)
      drops = Array.from({ length: cols }, (_, i) => ({
        x: i * fontSize,
        y: Math.random() * canvas.height,
        speed: 2 + Math.random() * 5,
      }))
      // 底色铺满一次，避免首帧透明闪烁
      ctx.fillStyle = '#030905'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    const draw = () => {
      // 半透明底色覆盖 → 形成渐隐拖尾
      ctx.fillStyle = 'rgba(3, 9, 5, 0.09)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.font = `${fontSize}px monospace`

      for (const d of drops) {
        const ch = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        // 头部亮绿，随机少数高亮近白
        ctx.fillStyle = Math.random() > 0.975 ? '#d7ffd7' : '#37d95e'
        ctx.fillText(ch, d.x, d.y)

        d.y += d.speed * fontSize * 0.55
        if (d.y > canvas.height && Math.random() > 0.972) {
          d.y = 0
          d.speed = 2 + Math.random() * 5
        }
      }
    }

    const loop = () => {
      draw()
      raf = window.setTimeout(() => { raf = requestAnimationFrame(loop) }, 33)
    }

    resize()
    if (reduced) {
      // 减动效：只静帧渲染一层雨幕
      for (let i = 0; i < 24; i++) draw()
    } else {
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(raf as unknown as number)
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
