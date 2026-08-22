/**
 * 静谧星云背景：纯 CSS 实现（无 canvas）
 * 大尺度模糊色斑缓慢漂移 + 少量闪烁亮星，适合低功耗设备与阅读场景
 */
export default function NebulaBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none nebula-bg" style={{ zIndex: 0 }} aria-hidden="true">
      <div className="nebula-blob nebula-a" />
      <div className="nebula-blob nebula-b" />
      <div className="nebula-blob nebula-c" />
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={`star-${i}`}
          className="nebula-star"
          style={{
            left: `${(i * 53 + 7) % 100}%`,
            top: `${(i * 37 + 11) % 92}%`,
            width: i % 4 === 0 ? 3 : 2,
            height: i % 4 === 0 ? 3 : 2,
            animationDelay: `${(i % 6) * 0.9}s`,
          }}
        />
      ))}
    </div>
  )
}
