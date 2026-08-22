// 多模型交叉验证 — 流程示意图（详情面板用）

const PURPLE = '#6b46c1'
const CYAN = '#06b6d4'

const steps = [
  { label: '定义框架', sub: '统一分析维度', w: 90 },
  { label: '3 模型输出', sub: '独立报告 × 3', w: 90 },
  { label: '交叉验证', sub: '逐项比对 · 共识/矛盾', w: 110 },
  { label: '反调者', sub: '主动挑战结论', w: 90 },
  { label: '置信度评级', sub: 'P0/P1/P2 排序', w: 100 },
  { label: '输出结论', sub: '验证清单', w: 90 },
]

export default function FlowDiagram1({ className }: { className?: string }) {
  const totalW = steps.reduce((s, step) => s + step.w, 0) + (steps.length - 1) * 24 + 40
  const h = 130

  return (
    <div className={`w-full overflow-x-auto ${className ?? ''}`}>
      <svg viewBox={`0 0 ${totalW} ${h}`} className="h-28" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="flowGrad1" x1="0" y1="0" x2="1" y2="0">
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
              <rect x={x} y="25" width={step.w} height="48" rx="8" fill={step.w === 110 ? 'url(#flowGrad1)' : 'rgba(107,70,193,0.15)'} stroke={i < 3 ? PURPLE : CYAN} strokeWidth="0.8" strokeOpacity="0.4" />
              <text x={x + step.w / 2} y="53" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="Inter, sans-serif">{step.label}</text>
              <text x={x + step.w / 2} y="68" textAnchor="middle" fill="#9ca3af" fontSize="8" fontFamily="Inter, sans-serif">{step.sub}</text>

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
