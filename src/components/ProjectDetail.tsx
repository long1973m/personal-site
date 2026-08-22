import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { flowDiagrams, coverComponents } from './covers/CoverMap'

interface Project {
  id: string
  title: string
  description: string
  detailDescription?: string
  coverImage: string
  coverComponent?: string
  flowDiagram?: string
  link?: string
  github?: string
  tags?: string[]
}

interface ProjectDetailProps {
  project: Project
  onClose: () => void
}

export default function ProjectDetail({ project, onClose }: ProjectDetailProps) {
  const FlowSvg = useMemo(
    () => (project.flowDiagram ? flowDiagrams[project.flowDiagram] : null),
    [project.flowDiagram],
  )
  const CoverSvg = useMemo(
    () => (project.coverComponent ? coverComponents[project.coverComponent] : null),
    [project.coverComponent],
  )
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-ps5-dark/90 backdrop-blur-sm" />

      {/* Detail Panel */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative glass-strong rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
          aria-label="关闭"
        >
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Cover — 复用卡片的 SVG 封面组件（无 SVG 的项目回退到图片） */}
        <div className="relative h-64 md:h-80 overflow-hidden">
          {CoverSvg ? (
            <CoverSvg className="w-full h-full" />
          ) : (
            <motion.img
              layoutId={`project-cover-${project.id}`}
              src={project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ps5-dark via-ps5-dark/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 -mt-16 relative">
          {FlowSvg && (
            <div className="mb-6">
              <div className="text-xs font-medium text-gray-500 mb-2 tracking-wider uppercase">流程概览</div>
              <FlowSvg className="w-full" />
            </div>
          )}

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {project.title}
          </h2>

          <p className="text-gray-300 text-base leading-7 mb-6 whitespace-pre-line">
            {project.detailDescription || project.description}
          </p>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-sm px-3 py-1 rounded-full bg-ps5-purple/30 text-ps5-cyan border border-ps5-cyan/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                GitHub
              </a>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-ps5-purple/50 hover:bg-ps5-purple/70 text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                在线访问
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
