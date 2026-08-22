import { motion } from 'framer-motion'

interface AboutProps {
  paragraphs: string[]
  focusTopics: string[]
  interests?: string[]
  cvSections?: { title: string; items: string[] }[]
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

export default function About({ paragraphs, focusTopics, interests, cvSections, contact }: AboutProps) {
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

        <div className="md:flex md:gap-12">
          {/* 左栏：简介与方向 */}
          <div className="flex-1 min-w-0">
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-6 text-gray-300 leading-relaxed"
            >
              {paragraphs.map((paragraph, index) => (
                <motion.p key={index} variants={item}>
                  {paragraph}
                </motion.p>
              ))}
            </motion.div>

            <motion.div
              variants={item}
              initial="hidden"
              animate="show"
              className="mt-8 pt-6 border-t border-white/10"
            >
              <h3 className="text-lg font-semibold text-white mb-4">关注方向</h3>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="flex flex-wrap gap-3"
              >
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

            {interests && interests.length > 0 && (
              <motion.div
                variants={item}
                initial="hidden"
                animate="show"
                className="mt-8 pt-6 border-t border-white/10"
              >
                <h3 className="text-lg font-semibold text-white mb-4">当前关注</h3>
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="flex flex-wrap gap-3"
                >
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

            <motion.div
              variants={item}
              initial="hidden"
              animate="show"
              className="mt-8 pt-6 border-t border-white/10"
            >
              <h3 className="text-lg font-semibold text-white mb-4">联系方式</h3>
              <p className="text-gray-400">
                {contact}
              </p>
            </motion.div>
          </div>

          {/* 右栏：经历时间线 */}
          {cvSections && cvSections.length > 0 && (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="mt-12 md:mt-0 md:w-[42%] shrink-0"
            >
              <div className="space-y-8">
                {cvSections.map((section, idx) => (
                  <motion.div
                    key={idx}
                    variants={item}
                    className="relative pl-6 border-l-2 border-ps5-purple/30"
                  >
                    <span className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-ps5-cyan/70 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    <h3 className="text-base font-semibold text-white mb-2.5">{section.title}</h3>
                    <div className="space-y-2">
                      {section.items.map((entry, i) => (
                        <p key={i} className="text-gray-400 leading-relaxed text-sm">
                          {entry}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
