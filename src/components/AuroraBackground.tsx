/**
 * 极光氛围层：三个巨大的模糊光斑缓慢漂移
 * 位于粒子画布之上、内容之下，为页面提供深空般的色彩呼吸感
 * intensity 控制强度档位，palette 控制色系（cool=紫青蓝 / warm=橙红洋红 / ice=冰蓝 / rose=粉紫）
 */
interface AuroraBackgroundProps {
  intensity?: 'subtle' | 'normal' | 'enhanced'
  palette?: 'cool' | 'warm' | 'ice' | 'rose'
}

export default function AuroraBackground({ intensity = 'normal', palette = 'cool' }: AuroraBackgroundProps) {
  const classes = ['aurora']
  if (intensity !== 'normal') classes.push(`aurora-${intensity}`)
  if (palette !== 'cool') classes.push(`aurora-${palette}`)
  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${classes.join(' ')}`} aria-hidden="true">
      <div className="aurora-blob aurora-1" />
      <div className="aurora-blob aurora-2" />
      <div className="aurora-blob aurora-3" />
    </div>
  )
}
