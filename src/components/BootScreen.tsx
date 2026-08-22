import { useEffect } from 'react'
import { motion } from 'framer-motion'

interface BootScreenProps {
  nickname: string
  onFinish: () => void
}

/**
 * PS5 风格开机动画：
 * 黑场 → 中央光束展开 → 昵称流光扫过 → 进度条充满 → 淡出进入主页
 * 点击 / 按键可跳过；同一浏览器会话只播放一次（sessionStorage）
 */
export default function BootScreen({ nickname, onFinish }: BootScreenProps) {
  useEffect(() => {
    const timer = window.setTimeout(onFinish, 2600)
    const skip = () => onFinish()
    window.addEventListener('keydown', skip)
    window.addEventListener('pointerdown', skip)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('keydown', skip)
      window.removeEventListener('pointerdown', skip)
    }
  }, [onFinish])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center boot-vignette"
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(8px)' }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      {/* 中央水平光束 */}
      <div className="boot-beam" aria-hidden="true" />

      {/* 昵称流光标题 */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="relative"
      >
        <h1 className="boot-title">{nickname.toUpperCase()}</h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-4 text-[11px] tracking-[0.55em] text-gray-500 uppercase pl-[0.55em]"
      >
        Personal Space
      </motion.p>

      {/* 加载进度条 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-12 w-44 h-[3px] rounded-full bg-white/10 overflow-hidden"
      >
        <div className="boot-bar h-full w-full" />
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.45 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 text-[10px] tracking-[0.3em] text-gray-600"
      >
        点击任意处跳过
      </motion.p>
    </motion.div>
  )
}
