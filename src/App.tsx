import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ParticleBackground from './components/ParticleBackground'
import AuroraBackground from './components/AuroraBackground'
import GridFloor from './components/GridFloor'
import MouseGlow from './components/MouseGlow'
import NebulaBackground from './components/NebulaBackground'
import BootScreen from './components/BootScreen'
import CardGrid from './components/CardGrid'
import BackgroundBlur from './components/BackgroundBlur'
import ControlBar from './components/ControlBar'
import ProjectDetail from './components/ProjectDetail'
import Hero from './components/Hero'
import SidebarNav, { TabType } from './components/SidebarNav'
import MobileTabBar from './components/MobileTabBar'
import About from './components/About'
import Notes from './components/Notes'
import Footer from './components/Footer'
import { BACKGROUND_STYLES, getStoredBackgroundId, storeBackgroundId } from './theme/backgrounds'
import projects from './data/projects.json'
import notes from './data/notes.json'
import profile from './data/profile.json'

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

  const handleSelect = useCallback((index: number) => {
    setSelectedIndex(index)
  }, [])

  const handleOpenDetail = useCallback(() => {
    setShowDetail(true)
  }, [])

  const handleCloseDetail = useCallback(() => {
    setShowDetail(false)
  }, [])

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

  // 扫描线/噪点透明度跟随背景风格（CSS 变量注入到根节点）
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--scan-opacity', String(bgStyle.layers.scan))
    root.style.setProperty('--noise-opacity', String(bgStyle.layers.noise))
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
    <div className="min-h-screen bg-ps5-dark relative overflow-hidden">
      {/* PS5 开机动画 */}
      <AnimatePresence>
        {!booted && (
          <BootScreen nickname={profile.nickname} onFinish={handleBootFinish} />
        )}
      </AnimatePresence>

      {booted && (
        <>
          {/* ===== 背景图层栈（按当前风格组合渲染） ===== */}
          {bgStyle.layers.nebula && <NebulaBackground />}

          {bgStyle.layers.particles && (
            <ParticleBackground density={bgStyle.layers.density} hue={bgStyle.layers.particleHue} />
          )}

          {bgStyle.layers.aurora !== 'off' && (
            <AuroraBackground intensity={bgStyle.layers.aurora} />
          )}

          {bgStyle.layers.mouseGlow && <MouseGlow />}

          <BackgroundBlur project={currentProject} />

          {bgStyle.layers.gridFloor && (
            <GridFloor enhanced={bgStyle.layers.gridEnhanced} />
          )}

          <ControlBar
            nickname={profile.nickname}
            avatarUrl={profile.avatarUrl}
            backgroundId={bgStyle.id}
            onSelectBackground={handleSelectBackground}
            onReplayBoot={handleReplayBoot}
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
                    <About
                      paragraphs={profile.about.paragraphs}
                      focusTopics={profile.about.focusTopics}
                      interests={profile.about.interests}
                      cvSections={profile.about.cvSections}
                      contact={profile.about.contact}
                    />
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
                    <Notes notes={notes} />
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
              <ProjectDetail
                project={currentProject}
                onClose={handleCloseDetail}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  )
}

export default App
