import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type TabType = 'about' | 'projects' | 'notes' | 'past'

interface SidebarNavProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

const tabs: { id: TabType; label: string; icon: JSX.Element }[] = [
  {
    id: 'about',
    label: '关于',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    id: 'projects',
    label: '项目',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    id: 'notes',
    label: '笔记',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    id: 'past',
    label: '个人项目',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m8-6l-3 3 3 3" />
      </svg>
    ),
  },
]

export default function SidebarNav({ activeTab, onTabChange }: SidebarNavProps) {
  const [hoveredTab, setHoveredTab] = useState<TabType | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5, duration: 0.5 }}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden md:block"
    >
      <div className="glass rounded-2xl p-2 flex flex-col gap-2">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className="relative"
            onMouseEnter={() => setHoveredTab(tab.id)}
            onMouseLeave={() => setHoveredTab(null)}
          >
            <button
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex items-center gap-3 p-3 rounded-xl transition-all duration-300
                ${activeTab === tab.id 
                  ? 'bg-ps5-purple/30 text-ps5-cyan' 
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
                }
              `}
              aria-label={tab.label}
            >
              {tab.icon}
              
              {/* Label - slides out on hover */}
              <AnimatePresence>
                {hoveredTab === tab.id && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm font-medium whitespace-nowrap overflow-hidden"
                  >
                    {tab.label}
                  </motion.span>
                )}
              </AnimatePresence>
              
              {/* Active indicator */}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl border-2 border-ps5-cyan/50 pointer-events-none"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
