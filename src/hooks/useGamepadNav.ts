import { useEffect, useRef } from 'react'

/**
 * Gamepad 导航 Hook（标准手柄映射）
 * 十字键 14/15 或左摇杆横向 → 左右；A(0) 确认；B(1) 返回；Y(3) 额外动作
 * 通过 rAF 轮询 + 边沿检测（仅按下瞬间触发一次），摇杆带回中死区
 */
interface GamepadNavOptions {
  enabled?: boolean
  onLeft?: () => void
  onRight?: () => void
  onConfirm?: () => void
  onBack?: () => void
  onExtra?: () => void
}

export function useGamepadNav({ enabled = true, onLeft, onRight, onConfirm, onBack, onExtra }: GamepadNavOptions) {
  // 始终指向最新回调，避免 rAF 循环里的闭包过期
  const handlersRef = useRef({ onLeft, onRight, onConfirm, onBack, onExtra })
  handlersRef.current = { onLeft, onRight, onConfirm, onBack, onExtra }

  useEffect(() => {
    if (!enabled || typeof navigator.getGamepads !== 'function') return

    let raf = 0
    const prevButtons = new Set<number>()
    let axisState: 'idle' | 'left' | 'right' = 'idle'

    const loop = () => {
      const pads = navigator.getGamepads() ?? []
      const gp = Array.from(pads).find((p): p is Gamepad => !!p)
      if (gp) {
        const h = handlersRef.current
        const fire = (idx: number, fn?: () => void) => {
          const pressed = !!gp.buttons[idx]?.pressed
          if (pressed && !prevButtons.has(idx)) fn?.()
          if (pressed) prevButtons.add(idx)
          else prevButtons.delete(idx)
        }

        fire(14, h.onLeft)   // 十字键左
        fire(15, h.onRight)  // 十字键右
        fire(0, h.onConfirm) // A / Cross
        fire(1, h.onBack)    // B / Circle
        fire(3, h.onExtra)   // Y / Triangle

        // 左摇杆横向（带迟滞防抖）
        const ax = gp.axes[0] ?? 0
        if (axisState === 'idle') {
          if (ax < -0.55) { h.onLeft?.(); axisState = 'left' }
          else if (ax > 0.55) { h.onRight?.(); axisState = 'right' }
        } else if (axisState === 'left' && ax > -0.3) axisState = 'idle'
        else if (axisState === 'right' && ax < 0.3) axisState = 'idle'
      }
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [enabled])
}
