// Skill 化架构 — 流程示意图（详情面板用）

const PURPLE = '#6b46c1'
const CYAN = '#06b6d4'

const steps = [
  { label: '业务梳理', sub: '全流程拆解 + 痛点识别', w: 100 },
  { label: '打分排序', sub: 'ROI × 可行性 × 合规', w: 100 },
  { label: '选取场景', sub: 'P0 验证场景', w: 90 },
  { label: 'Skill 拆解', sub: '单一职责 · Schema 契约', w: 105 },
  { label: '流水线编排', sub: 'LLM/规则/RAG 串联', w: 100 },
  { label: '组合部署', sub: '跨场景复用', w: 90 },
]

export default function FlowDiagram2({ className }: { className?: string }) {
  const totalW = steps.reduce((s, step) => s + step.w, 0) + (steps.length - 1) * 24 + 40
  const h = 130

  return (
    <div className={`w-full overflow-x-auto ${className ?? ''}`}>
      <svg viewBox={`0 0 ${totalW} ${h}`} className="h-28" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="flowGrad2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={PURPLE} stopOpacity="0.4" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0.4" />
          </linearGradient>
        </defs>

        <rect width={totalW} height={h} fill="rgba(255,255,255,0.03)" rx="10" />

        {steps.map((step, i) => {
          let x = 20
          for (let j = 0; j < i; j++) x += steps[j].w + 24

          return (
            <g key={`step-${i}`}>
              <rect x={x} y="25" width={step.w} height="48" rx="8"
                fill={i < 3 ? 'rgba(107,70,193,0.15)' : i < 5 ? 'url(#flowGrad2)' : 'rgba(6,182,212,0.15)'}
                stroke={i < 3 ? PURPLE : CYAN}
                strokeWidth="0.8" strokeOpacity="0.4" />
              <text x={x + step.w / 2} y="53" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="Inter, sans-serif">{step.label}</text>
              <text x={x + step.w / 2} y="68" textAnchor="middle" fill="#9ca3af" fontSize="8" fontFamily="Inter, sans-serif">{step.sub}</text>

              {/* Zone label */}
              {i === 0 && (
                <text x={x + step.w / 2} y="100" textAnchor="middle" fill={PURPLE} fontSize="8" fontFamily="Inter, sans-serif" fontWeight="600">分析</text>
              )}
              {i === 4 && (
                <text x={x + step.w / 2} y="100" textAnchor="middle" fill={CYAN} fontSize="8" fontFamily="Inter, sans-serif" fontWeight="600">决策</text>
              )}

              {/* Arrow */}
              {i < steps.length - 1 && (
                <line x1={x + step.w + 4} y1="49" x2={x + step.w + 20} y2="49" stroke={CYAN} strokeWidth="1" strokeOpacity="0.3" />
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
