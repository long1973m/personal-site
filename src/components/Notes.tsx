import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import NotesCard from './NotesCard'

interface Note {
  id: string
  title: string
  summary: string
  category: string
  tags?: string[]
  source?: string
}

interface NotesProps {
  notes: Note[]
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
}

export default function Notes({ notes }: NotesProps) {
  // 分类统计（保持首次出现顺序）
  const categories = useMemo(() => {
    const counts: { name: string; count: number }[] = [{ name: '全部', count: notes.length }]
    const seen = new Map<string, number>()
    notes.forEach((n) => {
      seen.set(n.category, (seen.get(n.category) || 0) + 1)
    })
    seen.forEach((count, name) => counts.push({ name, count }))
    return counts
  }, [notes])

  const [activeCat, setActiveCat] = useState('全部')
  const filtered = activeCat === '全部' ? notes : notes.filter((n) => n.category === activeCat)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="glass rounded-3xl p-8">
        <div className="flex items-end justify-between mb-2">
          <h2 className="text-3xl font-bold text-white gradient-text-animated">知识笔记</h2>
          <span className="text-xs text-gray-500 pb-1">共 {notes.length} 篇</span>
        </div>
        <p className="text-gray-400 text-sm mb-6">来自 Notion 知识库的精选笔记</p>

        {/* 分类筛选 tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => {
            const active = cat.name === activeCat
            return (
              <button
                key={cat.name}
                onClick={() => setActiveCat(cat.name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                  active
                    ? 'bg-ps5-cyan/15 text-ps5-cyan border-ps5-cyan/40 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:text-gray-200 hover:border-white/20'
                }`}
              >
                {cat.name}
                <span className={`ml-1.5 ${active ? 'text-ps5-cyan/70' : 'text-gray-600'}`}>{cat.count}</span>
              </button>
            )
          })}
        </div>

        {/* 双栏卡片网格 */}
        <motion.div
          key={activeCat}
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 gap-3"
        >
          {filtered.map((note, index) => (
            <NotesCard key={note.id} note={note} index={index} />
          ))}
        </motion.div>

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-gray-500 text-sm text-center">
            已整理 {notes.length} 篇 · 更多笔记持续更新中
          </p>
        </div>
      </div>
    </motion.div>
  )
}
