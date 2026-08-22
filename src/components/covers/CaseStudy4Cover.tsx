// 风险知识库 × 三档产品形态 — 封面信息图
// 左侧统一知识库，扇形展开三种流程壳，底部三条设计红线

const PURPLE = '#6b46c1'
const CYAN = '#06b6d4'
const TEAL = '#14b8a6'

export default function CaseStudy4Cover({ className }: { className?: string }) {
  const w = 800, h = 600

  const tiers = [
    { name: '集团版', stages: '六阶段闭环', sub: '模板继承 · 差异项清单 · 集团审核', color: PURPLE, y: 120 },
    { name: '单店专业版', stages: '五阶段', sub: '同构裁剪 · 店长审批替代集团审核', color: '#8b5cf6', y: 262 },
    { name: '小店版', stages: '三阶段', sub: 'AI 直出一店一策 · 店主自闭环', color: CYAN, y: 404 },
  ]

  const kbRows = ['法规溯源', '检测方式', '执行频次', '证据要求']

  return (
    <div className={`w-full h-full ${className ?? ''}`}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="bg4" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0a0a1a" />
            <stop offset="100%" stopColor="#0d1a1f" />
          </linearGradient>
          <linearGradient id="kbGrad4" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={TEAL} stopOpacity="0.45" />
            <stop offset="100%" stopColor={PURPLE} stopOpacity="0.25" />
          </linearGradient>
          <filter id="glow4">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={w} height={h} fill="url(#bg4)" rx="12" />

        {/* 斜线装饰 */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`diag-${i}`} x1={i * 70} y1="0" x2={i * 70 + 100} y2={h} stroke="white" strokeWidth="0.5" opacity="0.02" />
        ))}

        {/* 标题 */}
        <text x="400" y="48" textAnchor="middle" fill="white" fontSize="19" fontWeight="700" fontFamily="Inter, sans-serif">
          知识库 × 三档形态
        </text>
        <text x="400" y="70" textAnchor="middle" fill="#9ca3af" fontSize="13" fontFamily="Inter, sans-serif">
          一套检查项母表 · 按客户成熟度配三种流程壳
        </text>

        {/* 左侧：风险知识库堆栈 */}
        <rect x="55" y="150" width="190" height="330" rx="12" fill="url(#kbGrad4)" stroke={TEAL} strokeWidth="1.2" strokeOpacity="0.5" filter="url(#glow4)" />
        <text x="150" y="185" textAnchor="middle" fill="white" fontSize="15" fontWeight="700" fontFamily="Inter, sans-serif">风险知识库</text>
        <text x="150" y="205" textAnchor="middle" fill={TEAL} fontSize="10" fontFamily="Inter, sans-serif">结构化检查项母表</text>
        {kbRows.map((row, i) => (
          <g key={`kb-${i}`}>
            <rect x="75" y={225 + i * 58} width="150" height="44" rx="8" fill="rgba(255,255,255,0.06)" stroke="white" strokeOpacity="0.12" />
            <circle cx="93" cy={247 + i * 58} r="3.5" fill={TEAL} opacity="0.8" />
            <text x="108" y={252 + i * 58} fill="#e5e7eb" fontSize="12" fontFamily="Inter, sans-serif">{row}</text>
          </g>
        ))}

        {/* 扇形连接线 */}
        {tiers.map((t, i) => (
          <path key={`fan-${i}`} d={`M 245 ${315} C 300 ${315}, 310 ${t.y + 52}, 355 ${t.y + 52}`}
            fill="none" stroke={t.color} strokeWidth="1.4" strokeOpacity="0.45" />
        ))}

        {/* 右侧三档形态卡 */}
        {tiers.map((t, i) => (
          <g key={`tier-${i}`}>
            <rect x="355" y={t.y} width="390" height="105" rx="12" fill={t.color} fillOpacity="0.16" stroke={t.color} strokeWidth="1.2" strokeOpacity="0.55" filter="url(#glow4)" />
            <rect x="373" y={t.y + 18} width="34" height="34" rx="8" fill={t.color} fillOpacity="0.35" />
            <text x="390" y={t.y + 41} textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif">{['六', '五', '三'][i]}</text>
            <text x="422" y={t.y + 33} fill="white" fontSize="15" fontWeight="600" fontFamily="Inter, sans-serif">{t.name}</text>
            <text x="422" y={t.y + 54} fill={t.color} fontSize="11" fontWeight="600" fontFamily="Inter, sans-serif">{t.stages}</text>
            <text x="373" y={t.y + 82} fill="#9ca3af" fontSize="11" fontFamily="Inter, sans-serif">{t.sub}</text>
          </g>
        ))}

        {/* 底部三条设计红线 */}
        {['AI 不判责', '强制项锁定', '反哺过人'].map((chip, i) => (
          <g key={`chip-${i}`}>
            <rect x={155 + i * 175} y="522" width="150" height="36" rx="18" fill="rgba(20,184,166,0.12)" stroke={TEAL} strokeWidth="0.8" strokeOpacity="0.5" />
            <text x={230 + i * 175} y="545" textAnchor="middle" fill="#99f6e4" fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif">{chip}</text>
          </g>
        ))}

        {/* 装饰 */}
        <circle cx="752" cy="90" r="4" fill={TEAL} opacity="0.25" />
        <circle cx="48" cy="530" r="7" fill={PURPLE} opacity="0.15" />
        <circle cx="700" cy="555" r="3" fill={CYAN} opacity="0.25" />
      </svg>
    </div>
  )
}
