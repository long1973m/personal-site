import { motion, AnimatePresence } from 'framer-motion'
import { useSound } from '../hooks/useSound'
import { BACKGROUND_STYLES } from '../theme/backgrounds'

interface SettingsPanelProps {
  open: boolean
  currentId: string
  onSelect: (id: string) => void
  onClose: () => void
  onReplayBoot: () => void
}

/**
 * PS5 控制中心风格的快捷设置面板：从顶栏齿轮下方弹出
 * 背景风格切换 + 开机动画重播彩蛋
 */
export default function SettingsPanel({ open, currentId, onSelect, onClose, onReplayBoot }: SettingsPanelProps) {
  const { playClick } = useSound({ volume: 0.25 })

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* 点击外部关闭 */}
          <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />

          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="absolute left-0 top-full mt-3 w-80 glass rounded-2xl p-5 z-50 shadow-2xl shadow-black/50"
            role="dialog"
            aria-label="外观设置"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white tracking-wide">外观设置</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="关闭设置"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* 背景风格列表 */}
            <div className="space-y-1.5">
              {BACKGROUND_STYLES.map((style) => {
                const active = style.id === currentId
                return (
                  <button
                    key={style.id}
                    onClick={() => { playClick(); onSelect(style.id) }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all duration-200 ${
                      active
                        ? 'border-ps5-cyan/50 bg-ps5-cyan/10'
                        : 'border-transparent hover:bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <span
                      className="w-11 h-7 rounded-md flex-shrink-0 border border-white/20"
                      style={{ background: style.preview }}
                      aria-hidden="true"
                    />
                    <span className="flex-1 min-w-0">
                      <span className={`block text-sm font-medium ${active ? 'text-ps5-cyan' : 'text-gray-200'}`}>
                        {style.name}
                      </span>
                      <span className="block text-[11px] text-gray-500 truncate">{style.desc}</span>
                    </span>
                    {active && (
                      <svg className="w-4 h-4 text-ps5-cyan flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>

            {/* 底部：开机动画重播彩蛋 */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <button
                onClick={() => { playClick(); onReplayBoot() }}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                重播开机动画
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
