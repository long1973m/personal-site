import { useState } from 'react'
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

interface PastWorksProps {
  works: PastWork[]
  onOpen: (work: PastWork) => void
}

// 安静陈列：无地面反光、无呼吸辉光、无四角框，像书架上摆着的东西
const ACCENTS = [
  'from-ps5-purple/60 to-ps5-cyan/60',
  'from-ps5-cyan/60 to-emerald-400/60',
  'from-amber-400/60 to-ps5-purple/60',
  'from-rose-400/60 to-ps5-cyan/60',
]

export default function PastWorks({ works, onOpen }: PastWorksProps) {
  const [hovered, setHovered] = useState<string | null>(null)

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
          <h2 className="text-3xl font-bold text-white gradient-text-animated">旧作</h2>
          <span className="text-xs text-gray-500 pb-1">Past Works</span>
        </div>
        <p className="text-gray-400 text-sm mb-8">以前做过的东西 —— 不成体系，但都是真的动手做过的</p>

        <div className="grid md:grid-cols-2 gap-4">
          {works.map((work, index) => {
            const accent = ACCENTS[index % ACCENTS.length]
            const isHovered = hovered === work.id
            return (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onOpen(work)}
                onMouseEnter={() => setHovered(work.id)}
                onMouseLeave={() => setHovered(null)}
                className="relative cursor-pointer rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20"
                style={{
                  transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
                }}
              >
                {/* 顶部色条 */}
                <div className={`h-1 w-full bg-gradient-to-r ${accent}`} />

                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-white group-hover:text-ps5-cyan transition-colors">
                      {work.title}
                    </h3>
                    <span className="text-xs text-gray-500 font-mono">{work.year}</span>
                  </div>

                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 mb-4">
                    {work.what}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {work.tech.map((t) => (
                        <span
                          key={t}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500 border border-white/10"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    {work.link && (
                      <svg className="w-4 h-4 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* hover 时的展开箭头 */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="absolute bottom-4 right-5 text-ps5-cyan text-xs font-medium flex items-center gap-1"
                  >
                    查看详情
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}