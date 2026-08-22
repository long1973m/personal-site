/**
 * 合成波透视网格地面：底部 Tron 风格地板，网格持续向观者滚动
 * 顶端有地平线光带，向上渐隐融入背景
 * enhanced 为赛博网格风格的增强态（更亮的地平线与网格）
 */
interface GridFloorProps {
  enhanced?: boolean
}

export default function GridFloor({ enhanced = false }: GridFloorProps) {
  return (
    <div
      className={`fixed inset-x-0 bottom-0 h-[42vh] overflow-hidden pointer-events-none grid-floor-wrap${enhanced ? ' grid-enhanced' : ''}`}
      aria-hidden="true"
    >
      <div className="grid-horizon" />
      <div className="grid-floor" />
    </div>
  )
}
