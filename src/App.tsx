import { useState, useCallback, useEffect, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ParticleBackground from './components/ParticleBackground'
import AuroraBackground from './components/AuroraBackground'
import GridFloor from './components/GridFloor'
import MouseGlow from './components/MouseGlow'
import NebulaBackground from './components/NebulaBackground'
import RetroSun from './components/RetroSun'
import MatrixRain from './components/MatrixRain'
import Snowfall from './components/Snowfall'
import PetalsBackground from './components/PetalsBackground'
import BootScreen from './components/BootScreen'
import CardGrid from './components/CardGrid'
import BackgroundBlur from './components/BackgroundBlur'
import ControlBar from './components/ControlBar'
import Hero from './components/Hero'
import SidebarNav, { TabType } from './components/SidebarNav'
import MobileTabBar from './components/MobileTabBar'
import Footer from './components/Footer'
import { useGamepadNav } from './hooks/useGamepadNav'
import { BACKGROUND_STYLES, getStoredBackgroundId, storeBackgroundId } from './theme/backgrounds'
import projects from './data/projects.json'
import notes from './data/notes.json'
import profile from './data/profile.json'

interface NoteItem {
  id: string
  title: string
  summary: string
  category: string
  detail?: string
  point?: string
  value?: string
  tags?: string[]
  source?: string
}
const typedNotes = notes as NoteItem[]

// 懒加载分包：Notes / About / 两个详情弹窗 / 搜索面板按需加载，首屏只带主视图
const About = lazy(() => import('./components/About'))
const Notes = lazy(() => import('./components/Notes'))
const ProjectDetail = lazy(() => import('./components/ProjectDetail'))
const NoteDetail = lazy(() => import('./components/NoteDetail'))
const CommandPalette = lazy(() => import('./components/CommandPalette'))

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showDetail, setShowDetail] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('projects')
  // 背景风格：localStorage 持久化，设置面板切换
  const [backgroundId, setBackgroundId] = useState<string>(() => getStoredBackgroundId())
  // 开机动画：同一浏览器会话只播一次
  const [booted, setBooted] = useState(() => {
    try {
      return sessionStorage.getItem('ps5-booted') === '1'
    } catch {
      return false
    }
  })
  // 笔记详情 / 全站搜索 / 手柄连接状态
  const [activeNote, setActiveNote] = useState<NoteItem | null>(null)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [gamepadOn, setGamepadOn] = useState(false)
  const [padToast, setPadToast] = useState(false)

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index)
  }, [])

  const handleOpenDetail = useCallback(() => {
    setShowDetail(true)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setShowDetail(false)
  }, [])

  const handleOpenNote = useCallback((note: NoteItem) => {
    setActiveNote(note)
  }, [])

  const handleCloseNote = useCallback(() => {
    setActiveNote(null)
  }, [])

  const handleCycleBackground = useCallback(() => {
    setBackgroundId(prev => {
      const idx = BACKGROUND_STYLES.findIndex(b => b.id === prev)
      const next = BACKGROUND_STYLES[(idx + 1) % BACKGROUND_STYLES.length]
      storeBackgroundId(next.id)
      return next.id
    })
  }, [])

  // ⌘K / Ctrl+K 唤起全站搜索
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen(v => !v)
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [])

  // 手柄热插拔监听 + 连接提示
  useEffect(() => {
    let toastTimer = 0
    const onConnect = () => {
      setGamepadOn(true)
      setPadToast(true)
      window.clearTimeout(toastTimer)
      toastTimer = window.setTimeout(() => setPadToast(false), 2800)
    }
    const onDisconnect = () => setGamepadOn(false)
    window.addEventListener('gamepadconnected', onConnect)
    window.addEventListener('gamepaddisconnected', onDisconnect)
    return () => {
      window.clearTimeout(toastTimer)
      window.removeEventListener('gamepadconnected', onConnect)
      window.removeEventListener('gamepaddisconnected', onDisconnect)
    }
  }, [])

  // 手柄导航：十字键/左摇杆选卡片，A 进详情，B 退出，Y 切换背景风格
  useGamepadNav({
    enabled: booted && gamepadOn && !paletteOpen,
    onLeft: () => {
      if (activeTab === 'projects' && !showDetail) setSelectedIndex(i => Math.max(0, i - 1))
    },
    onRight: () => {
      if (activeTab === 'projects' && !showDetail) setSelectedIndex(i => Math.min(projects.length - 1, i + 1))
    },
    onConfirm: () => {
      if (activeTab === 'projects' && !showDetail) setShowDetail(true)
    },
    onBack: () => {
      if (showDetail) setShowDetail(false)
    },
    onExtra: handleCycleBackground,
  })

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab)
  }, [])

  const handleBootFinish = useCallback(() => {
    try {
      sessionStorage.setItem('ps5-booted', '1')
    } catch {
      // 隐私模式下忽略
    }
    setBooted(true)
  }, [])

  const bgStyle = BACKGROUND_STYLES.find(b => b.id === backgroundId) ?? BACKGROUND_STYLES[0]

  // 底色基调 + 扫描线/噪点透明度跟随背景风格（CSS 变量注入根节点，body 同步底色）
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--scan-opacity', String(bgStyle.layers.scan))
    root.style.setProperty('--noise-opacity', String(bgStyle.layers.noise))
    document.body.style.background = bgStyle.base
  }, [bgStyle])

  const handleSelectBackground = useCallback((id: string) => {
    storeBackgroundId(id)
    setBackgroundId(id)
  }, [])

  const handleReplayBoot = useCallback(() => {
    try {
      sessionStorage.removeItem('ps5-booted')
    } catch {
      // 隐私模式下忽略
    }
    window.location.reload()
  }, [])

  const currentProject = projects[selectedIndex] || null

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: bgStyle.base }}>
      {/* PS5 开机动画 */}
      <AnimatePresence>
        {!booted && (
          <BootScreen nickname={profile.nickname} onFinish={handleBootFinish} />
        )}
      </AnimatePresence>

      {booted && (
        <>
          {/* ===== 背景图层栈（按当前风格组合渲染） ===== */}
          {bgStyle.layers.matrix && <MatrixRain />}

          {bgStyle.layers.snow && <Snowfall />}

          {bgStyle.layers.petals && <PetalsBackground />}

          {bgStyle.layers.nebula && <NebulaBackground />}

          {bgStyle.layers.particles && (
            <ParticleBackground density={bgStyle.layers.density} hue={bgStyle.layers.particleHue} />
          )}

          {bgStyle.layers.aurora !== 'off' && (
            <AuroraBackground intensity={bgStyle.layers.aurora} palette={bgStyle.layers.auroraPalette} />
          )}

          {bgStyle.layers.mouseGlow && <MouseGlow color={bgStyle.glow} />}

          <BackgroundBlur project={currentProject} />

          {bgStyle.layers.gridFloor && (
            <GridFloor enhanced={bgStyle.layers.gridEnhanced} />
          )}

          {bgStyle.layers.sun && <RetroSun />}

          <ControlBar
            nickname={profile.nickname}
            avatarUrl={profile.avatarUrl}
            backgroundId={bgStyle.id}
            onSelectBackground={handleSelectBackground}
            onReplayBoot={handleReplayBoot}
            onOpenSearch={() => setPaletteOpen(true)}
          />

          <SidebarNav
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          <MobileTabBar
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          <div className="relative z-20 md:ml-16 pb-16 md:pb-0">
            <main className="pt-28 pb-20 min-h-screen flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {activeTab === 'about' && (
                  <motion.div
                    key="about"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Suspense fallback={null}>
                      <About
                        paragraphs={profile.about.paragraphs}
                        focusTopics={profile.about.focusTopics}
                        interests={profile.about.interests}
                        journey={profile.about.journey}
                        beliefs={profile.about.beliefs}
                        contact={profile.about.contact}
                      />
                    </Suspense>
                  </motion.div>
                )}

                {activeTab === 'projects' && (
                  <motion.div
                    key="projects"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Hero
                      nickname={profile.nickname}
                      avatarUrl={profile.avatarUrl}
                      slogan={profile.slogan}
                      tags={profile.tags}
                      socialLinks={profile.socialLinks}
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="text-center mb-12 px-4"
                    >
                      <div className="flex items-center justify-center gap-5 mb-4">
                        <span className="title-line" aria-hidden="true" />
                        <h2 className="text-3xl md:text-4xl font-bold gradient-text-animated">
                          我的项目
                        </h2>
                        <span className="title-line title-line-r" aria-hidden="true" />
                      </div>
                      <p className="text-gray-400 text-lg">
                        探索我的工作与创作
                      </p>
                    </motion.div>

                    <CardGrid
                      projects={projects}
                      selectedIndex={selectedIndex}
                      onSelect={handleSelect}
                      onOpenDetail={handleOpenDetail}
                      disabled={showDetail}
                      showDetail={showDetail}
                    />
                  </motion.div>
                )}

                {activeTab === 'notes' && (
                  <motion.div
                    key="notes"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Suspense fallback={null}>
                      <Notes notes={typedNotes} onOpenNote={handleOpenNote} />
                    </Suspense>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            <Footer
              techStack={profile.techStack}
              socialLinks={profile.socialLinks}
              copyright={profile.copyright}
            />
          </div>

          <AnimatePresence>
            {showDetail && currentProject && (
              <Suspense fallback={null}>
                <ProjectDetail
                  project={currentProject}
                  onClose={handleCloseDetail}
                />
              </Suspense>
            )}
          </AnimatePresence>

          {/* 笔记详情弹窗 */}
          <AnimatePresence>
            {activeNote && (
              <Suspense fallback={null}>
                <NoteDetail note={activeNote} onClose={handleCloseNote} />
              </Suspense>
            )}
          </AnimatePresence>

          {/* ⌘K 全站搜索 */}
          <AnimatePresence>
            {paletteOpen && (
              <Suspense fallback={null}>
                <CommandPalette
                  open
                  projects={projects}
                  notes={typedNotes}
                  onClose={() => setPaletteOpen(false)}
                  onPickProject={(index) => {
                    setActiveTab('projects')
                    setSelectedIndex(index)
                    setShowDetail(true)
                  }}
                  onPickNote={(note) => {
                    setActiveTab('notes')
                    setActiveNote(note)
                  }}
                />
              </Suspense>
            )}
          </AnimatePresence>

          {/* 手柄连接提示 */}
          <AnimatePresence>
            {padToast && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed bottom-24 md:bottom-8 right-4 md:right-8 z-[60] glass-strong rounded-full px-5 py-3 flex items-center gap-2.5 shadow-xl shadow-black/40"
              >
                <span className="text-lg">🎮</span>
                <span className="text-xs sm:text-sm text-gray-200">手柄已连接 · 十字键选择 / A 确认 / B 返回 / Y 换背景</span>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}

export default App
