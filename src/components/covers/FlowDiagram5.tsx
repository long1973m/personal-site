// 语义知识工程问数链路 — 流程示意图（详情面板用）

const BLUE = '#3b82f6'
const CYAN = '#06b6d4'

const steps = [
  { label: '自然语言', sub: '业务问题', w: 92 },
  { label: '术语归一', sub: '同义词映射', w: 92 },
  { label: '选表', sub: '表卡片路由', w: 88 },
  { label: '字段切片', sub: '按需加载', w: 92 },
  { label: '只读 SQL', sub: '命中指标口径', w: 98 },
  { label: '出口校验', sub: '权限 · LIMIT', w: 98 },
  { label: '结果+口径', sub: '可审计输出', w: 100 },
]

export default function FlowDiagram5({ className }: { className?: string }) {
  const totalW = steps.reduce((s, step) => s + step.w, 0) + (steps.length - 1) * 20 + 40
  const h = 130

  return (
    <div className={`w-full overflow-x-auto ${className ?? ''}`}>
      <svg viewBox={`0 0 ${totalW} ${h}`} className="h-28" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="flowGrad5" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={BLUE} stopOpacity="0.4" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0.4" />
          </linearGradient>
        </defs>

        <rect width={totalW} height={h} fill="rgba(255,255,255,0.03)" rx="10" />

        {steps.map((step, i) => {
          let x = 20
          for (let j = 0; j < i; j++) x += steps[j].w + 20
          const isGate = i === 5

          return (
            <g key={`step-${i}`}>
              <rect x={x} y="25" width={step.w} height="48" rx="8" fill={isGate ? 'rgba(6,182,212,0.16)' : i === 0 ? 'url(#flowGrad5)' : 'rgba(59,130,246,0.12)'} stroke={isGate ? CYAN : BLUE} strokeWidth={isGate ? 1.2 : 0.8} strokeOpacity="0.5" strokeDasharray={isGate ? '5 3' : undefined} />
              <text x={x + step.w / 2} y="53" textAnchor="middle" fill="white" fontSize="11" fontWeight="600" fontFamily="Inter, sans-serif">{step.label}</text>
              <text x={x + step.w / 2} y="68" textAnchor="middle" fill="#9ca3af" fontSize="8" fontFamily="Inter, sans-serif">{step.sub}</text>

              {i < steps.length - 1 && (
                <line x1={x + step.w + 3} y1="49" x2={x + step.w + 17} y2="49" stroke={BLUE} strokeWidth="1" strokeOpacity="0.35" />
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}
