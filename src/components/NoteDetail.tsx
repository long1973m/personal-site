import { useEffect } from 'react'
import { motion } from 'framer-motion'

interface Note {
  id: string
  title: string
  summary: string
  category: string
  detail?: string
  tags?: string[]
  source?: string
}

interface NoteDetailProps {
  note: Note
  onClose: () => void
}

/**
 * 笔记详情弹窗：封面区换成分类信息头，正文展示完整摘要（detail 优先）
 * 与 ProjectDetail 同款交互四件套：Escape 关闭 / 背景滚动锁 / 内部滚动 / 点击遮罩关闭
 */
export default function NoteDetail({ note, onClose }: NoteDetailProps) {
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

  const body = note.detail || note.summary

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
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative glass-strong rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 信息头 */}
        <div className="relative shrink-0 px-7 pt-7 pb-5 border-b border-white/10 bg-gradient-to-b from-ps5-purple/20 to-transparent">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
            aria-label="关闭"
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex items-center gap-2 mb-3 pr-10">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-ps5-cyan/15 text-ps5-cyan border border-ps5-cyan/30">
              {note.category}
            </span>
            {note.source && (
              <span className="text-xs text-gray-500">{note.source}</span>
            )}
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white leading-snug pr-8">
            {note.title}
          </h2>
        </div>

        {/* 正文滚动区 */}
        <div className="overflow-y-auto px-7 py-6">
          <p className="text-gray-300 text-base leading-8 whitespace-pre-line">
            {body}
          </p>

          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-6 pt-5 border-t border-white/10">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 text-gray-400 border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {!note.detail && (
            <p className="text-xs text-gray-600 mt-6">
              摘要版内容 · 完整版收录于 Notion 学习库
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
