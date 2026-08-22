import { motion, AnimatePresence } from 'framer-motion'

interface Project {
  id: string
  accentColor?: string
}

interface BackgroundBlurProps {
  project: Project | null
}

/** 无选中项目时的默认氛围色（主题紫） */
const DEFAULT_COLOR = '#6b46c1'

/**
 * 背景氛围层：直接使用 projects.json 中定义的 accentColor
 * 不再从占位图提取主色 —— 保证环境光与卡片信息图配色始终一致
 * 注意：accentColor 必须是 6 位 hex（代码用 `${color}XX` 拼接 alpha）
 */
export default function BackgroundBlur({ project }: BackgroundBlurProps) {
  const color = project?.accentColor || DEFAULT_COLOR

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* 基础氛围（始终存在，主色切换时平滑过渡） */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse at center, ${color}30 0%, transparent 70%)`,
        }}
      />

      {/* 当前项目的环境光（项目切换时交叉淡入淡出） */}
      <AnimatePresence>
        {project && (
          <motion.div
            key={project.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* 主环境光 — 呼吸动画 */}
            <div
              className="absolute inset-0 animate-radial-breathe"
              style={{
                background: `radial-gradient(ellipse at center, ${color}40 0%, transparent 70%)`,
              }}
            />

            {/* 左上偏移的次级光斑 */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 30% 40%, ${color}20 0%, transparent 50%)`,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 上下压暗，保证内容可读性 */}
      <div className="absolute inset-0 bg-gradient-to-b from-ps5-dark/40 via-transparent to-ps5-dark/80" />
    </div>
  )
}
