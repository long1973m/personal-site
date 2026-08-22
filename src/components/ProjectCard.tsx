import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSound } from '../hooks/useSound'
import { coverComponents } from './covers/CoverMap'

interface Project {
  id: string
  title: string
  description: string
  coverImage: string
  coverComponent?: string
  link?: string
  github?: string
  tags?: string[]
}

interface ProjectCardProps {
  project: Project
  isSelected: boolean
  isAnySelected: boolean
  onClick: () => void
  onOpenDetail: () => void
  showDetail: boolean
}

export default function ProjectCard({ project, isSelected, isAnySelected, onClick, onOpenDetail, showDetail }: ProjectCardProps) {
  const isUnselected = isAnySelected && !isSelected
  const { playHover } = useSound({ volume: 0.15 })
  const [imgError, setImgError] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !isSelected) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePosition({ x, y })
  }

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 })
  }

  const handleDoubleClick = () => {
    if (isSelected) {
      onOpenDetail()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isSelected) {
      onOpenDetail()
    }
  }

  const firstLetter = project.title.charAt(0).toUpperCase()
  const CoverSvg = project.coverComponent ? coverComponents[project.coverComponent] : null

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ perspective: '1000px' }}
    >
      {/* 地面反光 — 卡片像悬浮在发光地板上 */}
      <div className={`card-floor ${isSelected ? 'card-floor-active' : ''}`} aria-hidden="true" />
      <motion.div
        ref={cardRef}
        layout
        onClick={onClick}
        onDoubleClick={handleDoubleClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={playHover}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        tabIndex={0}
        role="button"
        aria-selected={isSelected}
        className={`
          relative cursor-pointer rounded-2xl overflow-hidden
          w-[280px] h-[380px] md:w-[320px] md:h-[420px] flex-shrink-0
          transition-all duration-500 ease-out
          ${isSelected ? 'glass-strong animate-breathing-glow ring-2 ring-ps5-cyan/60 ring-offset-2 ring-offset-transparent' : 'glass'}
          focus:outline-none focus:ring-2 focus:ring-ps5-cyan/80 focus:ring-offset-2 focus:ring-offset-ps5-dark
        `}
        animate={{
          scale: isSelected ? 1.05 : isUnselected ? 0.95 : 1,
          y: isSelected ? -5 : 0,
          opacity: isUnselected ? 0.6 : 1,
          filter: isUnselected ? 'brightness(0.7)' : 'brightness(1)',
          rotateX: isSelected ? -mousePosition.y * 6 : 0,
          rotateY: isSelected ? mousePosition.x * 6 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
        whileHover={{ scale: isSelected ? 1.05 : isUnselected ? 0.97 : 1.02 }}
      >
        {/* Breathing glow overlay for selected card */}
        {isSelected && (
          <>
            <div className="absolute inset-0 rounded-2xl pointer-events-none z-10 animate-pulse-slow" />
            {/* 高光扫过 sheen */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-20">
              <div className="sheen" />
            </div>
            {/* Corner focus indicators - console UI style（入场动画 + 辉光） */}
            {(['tl', 'tr', 'bl', 'br'] as const).map((pos) => (
              <motion.span
                key={pos}
                initial={{ opacity: 0, scale: 1.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                className={`corner-bracket corner-${pos} pointer-events-none z-20`}
              />
            ))}
          </>
        )}

        <div className="relative h-[60%] overflow-hidden">
          {imgError ? (
            <div className="w-full h-full bg-gradient-to-br from-ps5-purple to-ps5-cyan flex items-center justify-center">
              <span className="text-5xl font-bold text-white/80">{firstLetter}</span>
            </div>
          ) : CoverSvg ? (
            <CoverSvg className="w-full h-full" />
          ) : showDetail && isSelected ? (
            <div className="w-full h-full bg-gradient-to-br from-ps5-purple/50 to-ps5-cyan/50" />
          ) : (
            <motion.img
              layoutId={`project-cover-${project.id}`}
              src={project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ps5-dark/80 via-transparent to-transparent" />
        </div>

        <div className="p-5 h-[40%] flex flex-col justify-between">
          <div>
            <h3 className={`text-xl font-bold mb-2 transition-all duration-300 ${isSelected ? 'text-white selected-title-glow' : 'text-gray-300'}`}>
              {project.title}
            </h3>
            <p className={`text-sm line-clamp-2 transition-colors duration-300 ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
              {project.description}
            </p>
          </div>

          {project.tags && (
            <div className="flex flex-wrap gap-2 mt-3">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className={`text-xs px-2 py-1 rounded-full transition-all duration-300 ${
                    isSelected 
                      ? 'bg-ps5-purple/40 text-ps5-cyan border border-ps5-cyan/40' 
                      : 'bg-gray-700/30 text-gray-500 border border-gray-600/30'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none z-15"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              background: 'linear-gradient(135deg, rgba(107, 70, 193, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
            }}
          />
        )}
      </motion.div>

      {/* Hint below card - only when selected */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-3 whitespace-nowrap"
          >
            <span className="text-xs text-ps5-cyan/70 bg-ps5-dark/70 px-3 py-1 rounded-full border border-ps5-cyan/20">
              双击查看详情
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
