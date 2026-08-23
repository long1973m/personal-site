import { motion } from 'framer-motion'

interface Note {
  id: string
  title: string
  summary: string
  category: string
  tags?: string[]
  source?: string
}

interface NotesCardProps {
  note: Note
  index: number
  onClick?: () => void
}

const categoryColors: Record<string, string> = {
  'AI Agent': 'border-l-ps5-cyan',
  '数据分析': 'border-l-ps5-purple',
  '工程实践': 'border-l-emerald-400',
  '行业研究': 'border-l-amber-400',
}

export default function NotesCard({ note, index, onClick }: NotesCardProps) {
  const borderColor = categoryColors[note.category] || 'border-l-gray-400'

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      onClick={onClick}
      className={`glass rounded-2xl p-5 border-l-4 ${borderColor} hover:bg-white/10 transition-all duration-300 group ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-ps5-purple/20 text-ps5-cyan border border-ps5-cyan/20">
              {note.category}
            </span>
            {note.source && (
              <span className="text-xs text-gray-500">{note.source}</span>
            )}
          </div>
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-ps5-cyan transition-colors">
            {note.title}
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-3">
            {note.summary}
          </p>
          {note.tags && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500 border border-white/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <svg
          className="w-5 h-5 text-gray-600 group-hover:text-ps5-cyan transition-colors mt-1 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </motion.div>
  )
}
