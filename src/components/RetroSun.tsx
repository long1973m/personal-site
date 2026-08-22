/**
 * 霓虹日落（合成波）：带横向切缝的复古太阳，缓慢呼吸发光
 * 纯 CSS 实现；配合网格地面时落在地平线上方，经典 80s Retrowave 构图
 */
export default function RetroSun() {
  return (
    <div className="fixed inset-x-0 bottom-[30vh] overflow-hidden pointer-events-none flex justify-center" style={{ zIndex: 2 }} aria-hidden="true">
      <div className="retro-sun" />
    </div>
  )
}
