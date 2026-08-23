import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface ProjectItem {
  id: string
  title: string
  description: string
  tags?: string[]
}

interface NoteItem {
  id: string
  title: string
  summary: string
  category: string
  point?: string
  value?: string
  tags?: string[]
}

interface CommandPaletteProps {
  open: boolean
  projects: ProjectItem[]
  notes: NoteItem[]
  onClose: () => void
  onPickProject: (index: number) => void
  onPickNote: (note: NoteItem) => void
}

interface Result {
  kind: '项目' | '笔记'
  title: string
  sub: string
  projectIndex?: number
  note?: NoteItem
}

/**
 * ⌘K / Ctrl+K 全站搜索：项目 + 笔记的标题/摘要/标签模糊匹配
 * 方向键选择，回车确认；选中项目直接进入详情，选中笔记打开详情弹窗
 */
export default function CommandPalette({ open, projects, notes, onClose, onPickProject, onPickNote }: CommandPaletteProps) {
  const [q, setQ] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const results = useMemo<Result[]>(() => {
    const kw = q.trim().toLowerCase()
    const match = (...fields: (string | undefined)[]) =>
      !kw || fields.some((f) => f && f.toLowerCase().includes(kw))

    const p = projects
      .map((p, index) => ({ p, index }))
      .filter(({ p }) => match(p.title, p.description, ...(p.tags ?? [])))
      .map(({ p, index }) => ({ kind: '项目' as const, title: p.title, sub: p.description, projectIndex: index }))

    const n = notes
      .filter((n) => match(n.title, n.summary, n.category, n.point, n.value, ...(n.tags ?? [])))
      .map((n) => ({ kind: '笔记' as const, title: n.title, sub: n.summary, note: n }))

    return [...p, ...n].slice(0, 10)
  }, [q, projects, notes])

  // 打开时重置并聚焦
  useEffect(() => {
    if (open) {
      setQ('')
      setCursor(0)
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  // 键盘导航
  useEffect(() => {
    if (!open) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose() }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)) }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)) }
      else if (e.key === 'Enter' && results[cursor]) {
        e.preventDefault()
        pick(results[cursor])
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  })

  // 光标跟随滚动
  useEffect(() => {
    listRef.current?.querySelector(`[data-idx="${cursor}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [cursor])

  if (!open) return null

  const pick = (r: Result) => {
    if (r.kind === '项目' && r.projectIndex !== undefined) onPickProject(r.projectIndex)
    else if (r.note) onPickNote(r.note)
    onClose()
  }

  let lastKind = ''

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-[70] flex items-start justify-center pt-[13vh] px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <motion.div
        initial={{ scale: 0.96, y: -10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.96, y: -10, opacity: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className="relative w-full max-w-xl glass-strong rounded-2xl overflow-hidden shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="全站搜索"
      >
        {/* 搜索输入 */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
          <svg className="w-5 h-5 text-ps5-cyan flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => { setQ(e.target.value); setCursor(0) }}
            placeholder="搜索项目与笔记…"
            className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-base"
          />
          <kbd className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-400 border border-white/10">ESC</kbd>
        </div>

        {/* 结果列表 */}
        <div ref={listRef} className="max-h-[52vh] overflow-y-auto py-2">
          {results.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-8">没有匹配「{q}」的内容</p>
          )}
          {results.map((r, i) => {
            const showKind = r.kind !== lastKind
            lastKind = r.kind
            const active = i === cursor
            return (
              <div key={`${r.kind}-${r.title}-${i}`}>
                {showKind && (
                  <div className="px-5 pt-3 pb-1 text-[10px] font-semibold tracking-widest text-gray-600 uppercase">
                    {r.kind}
                  </div>
                )}
                <button
                  data-idx={i}
                  onMouseEnter={() => setCursor(i)}
                  onClick={() => pick(r)}
                  className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors ${
                    active ? 'bg-ps5-cyan/10' : 'hover:bg-white/5'
                  }`}
                >
                  <span className={`w-1 h-8 rounded-full flex-shrink-0 ${active ? 'bg-ps5-cyan shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-white/10'}`} />
                  <span className="flex-1 min-w-0">
                    <span className={`block text-sm truncate ${active ? 'text-ps5-cyan' : 'text-gray-200'}`}>{r.title}</span>
                    <span className="block text-xs text-gray-500 truncate">{r.sub}</span>
                  </span>
                  {active && (
                    <svg className="w-4 h-4 text-ps5-cyan flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* 底部提示 */}
        <div className="flex items-center gap-4 px-5 py-2.5 border-t border-white/10 text-[10px] text-gray-600">
          <span>↑↓ 选择</span>
          <span>↵ 打开</span>
          <span>ESC 关闭</span>
          <span className="ml-auto">{results.length} 条结果</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
