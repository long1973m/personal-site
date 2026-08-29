import { useEffect } from 'react'
import { motion } from 'framer-motion'

interface PastWork {
  id: string
  title: string
  year: string
  what: string
  why: string
  tech: string[]
  link?: string
}

interface PastWorkDetailProps {
  work: PastWork
  onClose: () => void
}

/**
 * 旧作详情弹窗：比项目详情更轻量 —— 无封面大图区、无流程图，
 * 只有「是什么 / 为什么做」两段事实层叙述 + 技术标签 + 链接。
 * 同款交互四件套：Escape / 背景滚动锁 / 内部滚动 / 点击遮罩关闭
 */
export default function PastWorkDetail({ work, onClose }: PastWorkDetailProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-ps5-dark/90 backdrop-blur-sm" />

      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative glass-strong rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          aria-label="关闭"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="overflow-y-auto px-7 py-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-ps5-cyan/70 border border-ps5-cyan/30 px-2 py-0.5 rounded-full">
              {work.year}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-6">{work.title}</h2>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1 h-3.5 rounded-full bg-ps5-cyan" />
                <span className="text-xs font-semibold tracking-widest text-ps5-cyan">是什么</span>
              </div>
              <p className="text-gray-300 leading-7">{work.what}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1 h-3.5 rounded-full bg-ps5-purple" />
                <span className="text-xs font-semibold tracking-widest text-gray-400">为什么做</span>
              </div>
              <p className="text-gray-300 leading-7">{work.why}</p>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex flex-wrap gap-1.5">
                {work.tech.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {work.link && (
              <a
                href={work.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-ps5-cyan hover:text-ps5-cyan/80 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3" />
                </svg>
                在 GitHub 查看
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}