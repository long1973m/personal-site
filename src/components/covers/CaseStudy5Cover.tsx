// 让模型按口径查数 — 封面信息图
// 问题 → 语义知识包 → 出口硬护栏 → 可审计结果 的四段式数据流

const BLUE = '#3b82f6'
const CYAN = '#06b6d4'
const PURPLE = '#6b46c1'

export default function CaseStudy5Cover({ className }: { className?: string }) {
  const w = 800, h = 600

  const pkgRows = ['表卡片 · 选表路由', '薄指标层 · 口径定义', 'Gotchas · 高压线', '术语同义词']
  const gates = ['权限注入', '只读账号', '单语句 LIMIT']

  return (
    <div className={`w-full h-full ${className ?? ''}`}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="bg5" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0a0a1a" />
            <stop offset="100%" stopColor="#0c1226" />
          </linearGradient>
          <linearGradient id="pkgGrad5" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={BLUE} stopOpacity="0.4" />
            <stop offset="100%" stopColor={PURPLE} stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow5">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={w} height={h} fill="url(#bg5)" rx="12" />

        {/* 扫描线装饰 */}
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`scan-${i}`} x1="0" y1={i * 30} x2={w} y2={i * 30} stroke="white" strokeWidth="0.5" opacity="0.015" />
        ))}

        {/* 标题 */}
        <text x="400" y="48" textAnchor="middle" fill="white" fontSize="19" fontWeight="700" fontFamily="Inter, sans-serif">
          让模型按口径查数
        </text>
        <text x="400" y="70" textAnchor="middle" fill="#9ca3af" fontSize="13" fontFamily="Inter, sans-serif">
          语义知识包 × 出口硬护栏 —— Data Agent 的知识工程
        </text>

        {/* ① 用户问题 */}
        <rect x="42" y="180" width="170" height="200" rx="14" fill="rgba(107,70,193,0.16)" stroke={PURPLE} strokeWidth="1.2" strokeOpacity="0.55" />
        <text x="127" y="215" textAnchor="middle" fill={PURPLE} fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif">自然语言问题</text>
        <rect x="60" y="235" width="134" height="34" rx="17" fill="rgba(255,255,255,0.06)" />
        <text x="127" y="257" textAnchor="middle" fill="#e5e7eb" fontSize="11" fontFamily="Inter, sans-serif">「本周 vs 上周？」</text>
        <rect x="60" y="278" width="134" height="34" rx="17" fill="rgba(255,255,255,0.06)" />
        <text x="127" y="300" textAnchor="middle" fill="#e5e7eb" fontSize="11" fontFamily="Inter, sans-serif">「超时率多少？」</text>
        <text x="127" y="350" textAnchor="middle" fill="#6b7280" fontSize="10" fontFamily="Inter, sans-serif">难的不是写 SQL</text>

        {/* ② 语义知识包 */}
        <rect x="268" y="150" width="200" height="260" rx="14" fill="url(#pkgGrad5)" stroke={BLUE} strokeWidth="1.2" strokeOpacity="0.55" filter="url(#glow5)" />
        <text x="368" y="182" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="Inter, sans-serif">分层语义知识包</text>
        {pkgRows.map((row, i) => (
          <g key={`pkg-${i}`}>
            <rect x="284" y={198 + i * 50} width="168" height="38" rx="8" fill="rgba(59,130,246,0.14)" stroke={BLUE} strokeWidth="0.7" strokeOpacity="0.4" />
            <text x="368" y={222 + i * 50} textAnchor="middle" fill="#dbeafe" fontSize="11" fontFamily="Inter, sans-serif">{row}</text>
          </g>
        ))}

        {/* ③ 出口硬护栏 */}
        <rect x="524" y="180" width="160" height="200" rx="14" fill="rgba(6,182,212,0.10)" stroke={CYAN} strokeWidth="1.4" strokeOpacity="0.6" strokeDasharray="6 4" filter="url(#glow5)" />
        <text x="604" y="212" textAnchor="middle" fill={CYAN} fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif">出口硬校验层</text>
        {gates.map((gate, i) => (
          <g key={`gate-${i}`}>
            <rect x="544" y={228 + i * 44} width="120" height="32" rx="8" fill="rgba(6,182,212,0.14)" />
            <text x="604" y={249 + i * 44} textAnchor="middle" fill="#a5f3fc" fontSize="11" fontWeight="500" fontFamily="Inter, sans-serif">{gate}</text>
          </g>
        ))}
        <text x="604" y="365" textAnchor="middle" fill="#6b7280" fontSize="10" fontFamily="Inter, sans-serif">不靠 prompt 自觉</text>

        {/* ④ 结果 */}
        <rect x="600" y="420" width="165" height="80" rx="12" fill="rgba(255,255,255,0.05)" stroke="white" strokeOpacity="0.15" />
        <text x="682" y="450" textAnchor="middle" fill="white" fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif">SQL + 口径声明</text>
        <text x="682" y="472" textAnchor="middle" fill="#9ca3af" fontSize="10" fontFamily="Inter, sans-serif">理解 → 口径 → 结果</text>
        <text x="682" y="490" textAnchor="middle" fill="#6b7280" fontSize="10" fontFamily="Inter, sans-serif">全程可审计</text>
        <line x1="604" y1="380" x2="650" y2="420" stroke={CYAN} strokeWidth="1.2" strokeOpacity="0.4" />

        {/* 主链路箭头 */}
        <line x1="212" y1="280" x2="264" y2="280" stroke={BLUE} strokeWidth="1.5" strokeOpacity="0.45" />
        <polygon points="264,280 256,276 256,284" fill={BLUE} opacity="0.45" />
        <line x1="468" y1="280" x2="520" y2="280" stroke={BLUE} strokeWidth="1.5" strokeOpacity="0.45" />
        <polygon points="520,280 512,276 512,284" fill={BLUE} opacity="0.45" />

        {/* 底部机制 chips */}
        {['渐进加载', '输出契约', '确认态 · 过时闸'].map((chip, i) => (
          <g key={`chip-${i}`}>
            <rect x={140 + i * 185} y="520" width="160" height="36" rx="18" fill="rgba(59,130,246,0.12)" stroke={BLUE} strokeWidth="0.8" strokeOpacity="0.5" />
            <text x={220 + i * 185} y="543" textAnchor="middle" fill="#bfdbfe" fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif">{chip}</text>
          </g>
        ))}

        {/* 装饰 */}
        <circle cx="748" cy="96" r="4" fill={BLUE} opacity="0.25" />
        <circle cx="52" cy="540" r="7" fill={PURPLE} opacity="0.15" />
        <circle cx="320" cy="105" r="3" fill={CYAN} opacity="0.3" />
      </svg>
    </div>
  )
}
