import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectCard from './ProjectCard'
import { useSound } from '../hooks/useSound'

interface Project {
  id: string
  title: string
  description: string
  coverImage: string
  coverComponent?: string
  flowDiagram?: string
  tags?: string[]
}

interface CardGridProps {
  projects: Project[]
  selectedIndex: number
  onSelect: (index: number) => void
  onOpenDetail: () => void
  disabled?: boolean
  showDetail?: boolean
}

export default function CardGrid({ projects, selectedIndex, onSelect, onOpenDetail, disabled = false }: CardGridProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isScrollLocked, setIsScrollLocked] = useState(false)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { playClick } = useSound({ volume: 0.3 })

  // Play click sound when selection changes
  useEffect(() => {
    if (selectedIndex >= 0) {
      playClick()
    }
  }, [selectedIndex, playClick])

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Desktop: scroll to selected card
  useEffect(() => {
    if (isMobile || !containerRef.current) return

    const container = containerRef.current
    const selectedCard = container.children[selectedIndex] as HTMLElement
    if (selectedCard) {
      const containerRect = container.getBoundingClientRect()
      const cardRect = selectedCard.getBoundingClientRect()
      const scrollLeft = cardRect.left - containerRect.left - (containerRect.width / 2) + (cardRect.width / 2)
      
      container.scrollTo({
        left: container.scrollLeft + scrollLeft,
        behavior: 'smooth',
      })
    }
  }, [selectedIndex, isMobile])

  // Desktop: keyboard navigation
  useEffect(() => {
    if (disabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        onSelect(Math.min(selectedIndex + 1, projects.length - 1))
      } else if (e.key === 'ArrowLeft') {
        onSelect(Math.max(selectedIndex - 1, 0))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedIndex, projects.length, onSelect, disabled])

  // Desktop: wheel navigation with debounce lock
  useEffect(() => {
    const container = containerRef.current
    if (!container || isMobile || disabled) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      
      // Lock if already scrolling
      if (isScrollLocked) return

      const delta = Math.abs(e.deltaY) + Math.abs(e.deltaX)
      
      // Accumulate delta, only switch when threshold reached
      if (delta < 30) return

      // Lock and switch
      setIsScrollLocked(true)
      
      if (e.deltaY > 0 || e.deltaX > 0) {
        onSelect(Math.min(selectedIndex + 1, projects.length - 1))
      } else {
        onSelect(Math.max(selectedIndex - 1, 0))
      }

      // Unlock after animation completes
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
      scrollTimeoutRef.current = setTimeout(() => {
        setIsScrollLocked(false)
      }, 500)
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => {
      container.removeEventListener('wheel', handleWheel)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [selectedIndex, projects.length, onSelect, isMobile, isScrollLocked, disabled])

  // Mobile: detect centered card via Intersection Observer
  useEffect(() => {
    const container = containerRef.current
    if (!container || !isMobile) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const index = Number(entry.target.getAttribute('data-index'))
            if (!isNaN(index)) {
              onSelect(index)
            }
          }
        })
      },
      {
        root: container,
        threshold: [0.5, 0.75, 1],
      }
    )

    const cards = container.querySelectorAll('[data-index]')
    cards.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [isMobile, onSelect])

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className={`
          ${isMobile 
            ? 'flex gap-4 px-[10vw] overflow-x-auto snap-x snap-mandatory py-12 scrollbar-hide'
            : 'flex gap-8 px-8 py-12 overflow-x-auto snap-x snap-mandatory pb-8 scrollbar-hide'
          }
        `}
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <AnimatePresence>
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              data-index={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={isMobile ? 'w-[80vw] flex-shrink-0 snap-center' : 'snap-center'}
            >
              <ProjectCard
                project={project}
                index={index}
                isSelected={index === selectedIndex}
                isAnySelected={selectedIndex !== -1}
                onClick={() => onSelect(index)}
                onOpenDetail={onOpenDetail}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Pagination dots - show on all devices */}
      <div className="flex justify-center gap-2 mt-6">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`
              w-2 h-2 rounded-full transition-all duration-300
              ${index === selectedIndex
                ? 'bg-ps5-cyan w-6 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                : 'bg-white/30 hover:bg-white/50'
              }
            `}
          />
        ))}
      </div>
    </div>
  )
}
