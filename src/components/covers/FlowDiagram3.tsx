// QA 清洗流程 — 流程示意图（详情面板用）

const PURPLE = '#6b46c1'
const CYAN = '#06b6d4'

const steps = [
  { label: '规则过滤', sub: '格式 + 重复 + 模板污染', w: 105 },
  { label: '语义去重', sub: 'Embedding + FAISS 聚类', w: 105 },
  { label: 'LLM 评分', sub: '4 维评分自动筛选', w: 100 },
  { label: '分布平衡', sub: 'K-means 下采样', w: 95 },
  { label: '人工审查', sub: 'P0/P1 优先级 + 裁决', w: 100 },
  { label: '训练就绪', sub: '高质量微调数据集', w: 95 },
]

export default function FlowDiagram3({ className }: { className?: string }) {
  const totalW = steps.reduce((s, step) => s + step.w, 0) + (steps.length - 1) * 24 + 40
  const h = 130

  return (
    <div className={`w-full overflow-x-auto ${className ?? ''}`}>
      <svg viewBox={`0 0 ${totalW} ${h}`} className="h-28" preserveAspectRatio="xMidYMid meet">
        <rect width={totalW} height={h} fill="rgba(255,255,255,0.03)" rx="10" />

        {steps.map((step, i) => {
          let x = 20
          for (let j = 0; j < i; j++) x += steps[j].w + 24

          const isAuto = i < 4
          const hue = i < 2 ? PURPLE : i < 4 ? '#5a3da8' : i < 5 ? '#3d7aa8' : CYAN

          return (
            <g key={`step-${i}`}>
              <rect x={x} y="25" width={step.w} height="48" rx="8"
                fill={hue} fillOpacity="0.15" stroke={hue} strokeWidth="0.8" strokeOpacity="0.4" />
              <text x={x + step.w / 2} y="53" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="Inter, sans-serif">{step.label}</text>
              <text x={x + step.w / 2} y="68" textAnchor="middle" fill="#9ca3af" fontSize="8" fontFamily="Inter, sans-serif">{step.sub}</text>

              {/* Cost label */}
              <text x={x + step.w / 2} y="100" textAnchor="middle" fill={hue} fontSize="8" fontFamily="Inter, sans-serif" opacity="0.6">
                {isAuto ? '自动 · 低成本' : '人工 · 高成本'}
              </text>

              {/* Arrow */}
              {i < steps.length - 1 && (
                <line x1={x + step.w + 4} y1="49" x2={x + step.w + 20} y2="49" stroke={hue} strokeWidth="1" strokeOpacity="0.3" />
              )}
            </g>
          )
        })}

        {/* Funnel overlay hint */}
        <path d="M 20 90 L 580 90 L 560 115 L 40 115 Z" fill={CYAN} fillOpacity="0.04" />
      </svg>
    </div>
  )
}
