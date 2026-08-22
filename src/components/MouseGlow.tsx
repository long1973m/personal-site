import { useEffect, useRef } from 'react'

/**
 * 鼠标跟随光晕：一层柔和的径向光，用 lerp 平滑追随光标
 * 仅桌面端（精确指针）启用；直接操作 style，避免 React 重渲染
 * color 由背景风格系统注入（hex），缺省沿用 .mouse-glow 类的紫青默认色
 */
interface MouseGlowProps {
  color?: string
}

export default function MouseGlow({ color }: MouseGlowProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    let raf = 0
    const target = { x: window.innerWidth / 2, y: window.innerHeight * 0.4 }
    const pos = { ...target }

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
    }

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.08
      pos.y += (target.y - pos.y) * 0.08
      if (ref.current) {
        ref.current.style.transform = `translate3d(${pos.x - 260}px, ${pos.y - 260}px, 0)`
      }
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="mouse-glow"
      style={color ? { background: `radial-gradient(circle, ${color}30 0%, ${color}14 34%, transparent 62%)` } : undefined}
      aria-hidden="true"
    />
  )
}
