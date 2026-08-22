// QA 数据清洗五阶段漏斗 — 封面信息图
// 倒漏斗 + 5 级阶梯，每级标注阶段名和通过率

const PURPLE = '#6b46c1'
const CYAN = '#06b6d4'

export default function CaseStudy3Cover({ className }: { className?: string }) {
  const w = 800, h = 600
  const stages = [
    { label: '规则过滤', pct: '70%', sub: '格式噪声 · 模板污染 · 语言一致性', grade: PURPLE, opacity: 0.5 },
    { label: '语义去重', pct: '50%', sub: 'MD5 精确去重 → Embedding 语义聚类', grade: PURPLE, opacity: 0.55 },
    { label: 'LLM 评分', pct: '30%', sub: '4 维评分 · 自动通过/拒绝/审核', grade: '#5a3da8', opacity: 0.55 },
    { label: '分布平衡', pct: '25%', sub: 'K-means 聚类 · 下采样/标记', grade: '#3d7aa8', opacity: 0.55 },
    { label: '人工审查', pct: '10%', sub: 'P0/P1 优先级 · 争议裁决', grade: CYAN, opacity: 0.5 },
  ]

  const boxW = 420
  const startX = (w - boxW) / 2
  const stepH = 90
  const gap = 8
  const topY = 110

  return (
    <div className={`w-full h-full ${className ?? ''}`}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="bg3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0a0a1a" />
            <stop offset="100%" stopColor="#12082a" />
          </linearGradient>
          <filter id="funnelGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={w} height={h} fill="url(#bg3)" rx="12" />

        {/* Horizontal scan lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`scan-${i}`} x1="0" y1={i * 30} x2={w} y2={i * 30} stroke="white" strokeWidth="0.5" opacity="0.015" />
        ))}

        {/* Title */}
        <text x="400" y="46" textAnchor="middle" fill="white" fontSize="18" fontWeight="700" fontFamily="Inter, sans-serif">
          QA 清洗五阶段漏斗
        </text>
        <text x="400" y="66" textAnchor="middle" fill="#9ca3af" fontSize="13" fontFamily="Inter, sans-serif">
          由粗到细 · 由廉到贵 · 百万级数据流水线
        </text>

        {/* Input indicator */}
        <text x={startX + boxW / 2} y="98" textAnchor="middle" fill={PURPLE} fontSize="11" fontFamily="Inter, sans-serif" fontWeight="600">
          ▼ 原始 QA 数据（百万级）▼
        </text>

        {/* Funnel stages */}
        {stages.map((s, i) => {
          const y = topY + i * (stepH + gap)
          const wAdj = boxW - i * 42
          const xAdj = startX + i * 21

          return (
            <g key={`stage-${i}`}>
              {/* Stage box */}
              <rect x={xAdj} y={y} width={wAdj} height={stepH} rx="8" fill={s.grade} fillOpacity={s.opacity} stroke={s.grade} strokeWidth="1" strokeOpacity="0.4" filter="url(#funnelGlow)" />

              {/* Stage number */}
              <rect x={xAdj + 10} y={y + 10} width="28" height="28" rx="6" fill={s.grade} fillOpacity="0.4" />
              <text x={xAdj + 24} y={y + 30} textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="Inter, sans-serif">
                S{i + 1}
              </text>

              {/* Stage label */}
              <text x={xAdj + 50} y={y + 30} fill="white" fontSize="14" fontWeight="600" fontFamily="Inter, sans-serif">
                {s.label}
              </text>

              {/* Subtext */}
              <text x={xAdj + 50} y={y + 52} fill="#9ca3af" fontSize="10" fontFamily="Inter, sans-serif">
                {s.sub}
              </text>

              {/* Percentage badge */}
              <rect x={xAdj + wAdj - 70} y={y + 14} width="56" height="28" rx="14" fill={s.grade} fillOpacity="0.35" stroke={s.grade} strokeWidth="0.5" strokeOpacity="0.4" />
              <text x={xAdj + wAdj - 42} y={y + 33} textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif">
                {s.pct}
              </text>

              {/* Arrow to next stage (except last) */}
              {i < stages.length - 1 && (
                <line x1={xAdj + wAdj / 2} y1={y + stepH} x2={xAdj + wAdj / 2} y2={y + stepH + gap} stroke={s.grade} strokeWidth="1" strokeOpacity="0.3" />
              )}
            </g>
          )
        })}

        {/* Cost indicator bar - right side */}
        <rect x="700" y={topY} width="16" height={stages.length * stepH + (stages.length - 1) * gap} rx="8" fill="white" fillOpacity="0.04" />
        <defs>
          <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PURPLE} />
            <stop offset="100%" stopColor={CYAN} />
          </linearGradient>
        </defs>
        <rect x="702" y={topY + 4} width="12" height={stages.length * stepH + (stages.length - 1) * gap - 8} rx="6" fill="url(#costGrad)" opacity="0.5" />
        <text x="726" y={topY + 25} fill="#9ca3af" fontSize="9" fontFamily="Inter, sans-serif" textAnchor="start">低</text>
        <text x="726" y={topY + stepH * stages.length + gap * (stages.length - 1) - 10} fill="#9ca3af" fontSize="9" fontFamily="Inter, sans-serif" textAnchor="start">高</text>
        <text x="700" y={topY / 2 + stepH * stages.length / 2 + gap * (stages.length / 2)} fill="#9ca3af" fontSize="9" fontFamily="Inter, sans-serif" textAnchor="start" transform={`rotate(-90, 740, ${topY + stepH * stages.length / 2})`}>
          成本递增
        </text>

        {/* Output */}
        <text x="400" y={topY + stages.length * (stepH + gap) + 25} textAnchor="middle" fill={CYAN} fontSize="12" fontFamily="Inter, sans-serif" fontWeight="600">
          ▼ 高质量训练集 ▼
        </text>

        {/* Decorative */}
        <circle cx="60" cy="120" r="3" fill={PURPLE} opacity="0.25" />
        <circle cx="50" cy="400" r="2" fill={CYAN} opacity="0.2" />
        <circle cx="750" cy="500" r="4" fill={PURPLE} opacity="0.15" />
      </svg>
    </div>
  )
}
