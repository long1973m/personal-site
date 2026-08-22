import { motion } from 'framer-motion'

interface AboutProps {
  paragraphs: string[]
  focusTopics: string[]
  interests?: string[]
  journey?: { steps: string[]; intro: string }
  beliefs?: string[]
  contact: string
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function About({ paragraphs, focusTopics, interests, journey, beliefs, contact }: AboutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="glass rounded-3xl p-8">
        <motion.h2
          variants={item}
          initial="hidden"
          animate="show"
          className="text-3xl font-bold text-white mb-8 gradient-text-animated"
        >
          关于我
        </motion.h2>

        {/* 开场白 */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-5 text-gray-300 leading-relaxed"
        >
          {paragraphs.map((paragraph, index) => (
            <motion.p key={index} variants={item}>
              {paragraph}
            </motion.p>
          ))}
        </motion.div>

        {/* 转型路径 stepper */}
        {journey && journey.steps.length > 0 && (
          <motion.div variants={item} initial="hidden" animate="show" className="mt-10">
            <h3 className="text-lg font-semibold text-white mb-5">我的路径</h3>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3">
              {journey.steps.map((step, i) => (
                <div key={step} className="flex items-center gap-2.5 sm:gap-3">
                  <motion.span
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.12 }}
                    className={`px-4 py-2 rounded-full text-sm border whitespace-nowrap ${
                      i === journey.steps.length - 1
                        ? 'bg-ps5-cyan/15 text-ps5-cyan border-ps5-cyan/40 shadow-[0_0_14px_rgba(6,182,212,0.25)]'
                        : 'bg-white/5 text-gray-300 border-white/10'
                    }`}
                  >
                    {step}
                  </motion.span>
                  {i < journey.steps.length - 1 && (
                    <svg className="w-4 h-4 text-ps5-purple flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
            {journey.intro && (
              <p className="text-gray-400 leading-relaxed mt-4 text-sm">{journey.intro}</p>
            )}
          </motion.div>
        )}

        {/* 信条卡片（替代简历式条目） */}
        {beliefs && beliefs.length > 0 && (
          <motion.div variants={container} initial="hidden" animate="show" className="mt-10">
            <h3 className="text-lg font-semibold text-white mb-5">我怎么看这件事</h3>
            <div className="grid sm:grid-cols-3 gap-3">
              {beliefs.map((belief, i) => (
                <motion.div
                  key={i}
                  variants={item}
                  className="relative rounded-2xl border border-white/10 bg-white/5 p-4 pt-5 hover:border-ps5-cyan/30 hover:bg-white/[0.07] transition-colors"
                >
                  <span className="absolute top-3 right-4 text-2xl font-bold text-ps5-cyan/20 font-mono">
                    0{i + 1}
                  </span>
                  <p className="text-sm text-gray-300 leading-relaxed">{belief}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 关注方向 */}
        <motion.div variants={item} initial="hidden" animate="show" className="mt-10 pt-6 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">关注方向</h3>
          <motion.div variants={container} initial="hidden" animate="show" className="flex flex-wrap gap-3">
            {focusTopics.map((topic) => (
              <motion.span
                key={topic}
                variants={item}
                className="px-4 py-2 rounded-full text-sm bg-ps5-purple/20 text-ps5-cyan border border-ps5-cyan/20"
              >
                {topic}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* 当前关注 */}
        {interests && interests.length > 0 && (
          <motion.div variants={item} initial="hidden" animate="show" className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">当前关注</h3>
            <motion.div variants={container} initial="hidden" animate="show" className="flex flex-wrap gap-3">
              {interests.map((interest) => (
                <motion.span
                  key={interest}
                  variants={item}
                  className="px-4 py-2 rounded-full text-sm bg-ps5-purple/10 text-ps5-cyan/80 border border-ps5-cyan/10"
                >
                  {interest}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* 联系方式 */}
        <motion.div variants={item} initial="hidden" animate="show" className="mt-8 pt-6 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">联系方式</h3>
          <p className="text-gray-400">
            {contact}
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
