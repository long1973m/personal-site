/**
 * 极光氛围层：三个巨大的模糊光斑（紫 / 青 / 蓝）缓慢漂移
 * 位于粒子画布之上、内容之下，为页面提供深空般的色彩呼吸感
 * intensity 由背景风格系统控制：subtle=弱化 / normal=默认 / enhanced=增强（赛博/极光流域风格）
 */
interface AuroraBackgroundProps {
  intensity?: 'subtle' | 'normal' | 'enhanced'
}

export default function AuroraBackground({ intensity = 'normal' }: AuroraBackgroundProps) {
  const intensityClass = intensity === 'normal' ? '' : ` aurora-${intensity}`
  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none aurora${intensityClass}`} aria-hidden="true">
      <div className="aurora-blob aurora-1" />
      <div className="aurora-blob aurora-2" />
      <div className="aurora-blob aurora-3" />
    </div>
  )
}
