import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SettingsPanel from './SettingsPanel'

interface ControlBarProps {
  nickname: string
  avatarUrl: string
  backgroundId: string
  onSelectBackground: (id: string) => void
  onReplayBoot: () => void
}

export default function ControlBar({ nickname, avatarUrl, backgroundId, onSelectBackground, onReplayBoot }: ControlBarProps) {
  const [time, setTime] = useState(new Date())
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      month: 'long',
      day: 'numeric',
      weekday: 'short'
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-40 px-6 py-3"
    >
      <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between max-w-7xl mx-auto relative">
        {/* Left: Icons + Time */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => { setBellOpen(v => !v); setSettingsOpen(false) }}
              className={`relative p-2 rounded-xl hover:bg-white/10 transition-colors ${bellOpen ? 'bg-white/10' : ''}`}
              aria-label="通知"
            >
              <svg
                className="w-5 h-5 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            {/* 通知下拉：当前无通知功能，如实呈现 */}
            <AnimatePresence>
              {bellOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setBellOpen(false)} aria-hidden="true" />
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute left-0 top-full mt-3 w-48 glass rounded-xl p-4 z-50 shadow-xl shadow-black/40"
                  >
                    <p className="text-sm text-gray-400 text-center">暂无新通知</p>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Settings — 背景风格切换入口 */}
          <div className="relative">
            <button
              onClick={() => { setSettingsOpen(v => !v); setBellOpen(false) }}
              className={`p-2 rounded-xl hover:bg-white/10 transition-colors ${settingsOpen ? 'bg-white/10' : ''}`}
              aria-label="设置"
            >
              <svg
                className={`w-5 h-5 text-gray-300 transition-transform duration-500 ${settingsOpen ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>

            <SettingsPanel
              open={settingsOpen}
              currentId={backgroundId}
              onSelect={onSelectBackground}
              onClose={() => setSettingsOpen(false)}
              onReplayBoot={onReplayBoot}
            />
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-white/20" />

          {/* Time & Date */}
          <span className="text-white text-lg font-mono font-medium tracking-wider">
            {formatTime(time)}
          </span>
          <span className="text-gray-400 text-sm hidden sm:inline">
            {formatDate(time)}
          </span>
        </div>

        {/* Right: User Profile */}
        <div className="flex items-center gap-3">
          <span className="text-gray-300 text-sm font-medium hidden sm:inline">
            {nickname}
          </span>
          <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-ps5-purple/50">
            <img
              src={avatarUrl}
              alt={nickname}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
