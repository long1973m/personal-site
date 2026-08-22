// 多模型交叉验证竞品分析法 — 封面信息图
// 三模型汇聚到中央交叉验证节点，输出可信结论

const PURPLE = '#6b46c1'
const CYAN = '#06b6d4'

export default function CaseStudy1Cover({ className }: { className?: string }) {
  const w = 800, h = 600
  const cx = w / 2, cy = h / 2

  return (
    <div className={`w-full h-full ${className ?? ''}`}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0a0a1a" />
            <stop offset="100%" stopColor="#12082a" />
          </linearGradient>
          <linearGradient id="modelGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={PURPLE} stopOpacity="0.6" />
            <stop offset="100%" stopColor={PURPLE} stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="hubGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={CYAN} stopOpacity="0.7" />
            <stop offset="100%" stopColor={PURPLE} stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="outputGrad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={CYAN} stopOpacity="0.5" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0.2" />
          </linearGradient>
          <filter id="glow1">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect width={w} height={h} fill="url(#bg1)" rx="12" />

        {/* Subtle grid dots */}
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 10 }).map((_, col) => (
            <circle key={`dot-${row}-${col}`} cx={col * 90 + 40} cy={row * 75 + 40} r="1" fill="white" opacity="0.04" />
          ))
        )}

        {/* Title */}
        <text x={cx} y="44" textAnchor="middle" fill="white" fontSize="18" fontWeight="700" fontFamily="Inter, sans-serif">
          多模型交叉验证
        </text>
        <text x={cx} y="64" textAnchor="middle" fill="#9ca3af" fontSize="13" fontFamily="Inter, sans-serif">
          三角验证 · 幻觉检测 · 置信度评级
        </text>

        {/* Model A - top left */}
        <rect x="80" y="140" width="190" height="100" rx="12" fill="url(#modelGrad1)" stroke={PURPLE} strokeWidth="1.5" strokeOpacity="0.5" />
        <text x="175" y="178" textAnchor="middle" fill="white" fontSize="14" fontWeight="600" fontFamily="Inter, sans-serif">LLM A</text>
        <text x="175" y="198" textAnchor="middle" fill="#9ca3af" fontSize="11" fontFamily="Inter, sans-serif">报告 A</text>
        <text x="175" y="214" textAnchor="middle" fill={PURPLE} fontSize="10" fontFamily="Inter, sans-serif">● 独立输出</text>

        {/* Model B - top right */}
        <rect x="530" y="140" width="190" height="100" rx="12" fill="url(#modelGrad1)" stroke={PURPLE} strokeWidth="1.5" strokeOpacity="0.5" />
        <text x="625" y="178" textAnchor="middle" fill="white" fontSize="14" fontWeight="600" fontFamily="Inter, sans-serif">LLM B</text>
        <text x="625" y="198" textAnchor="middle" fill="#9ca3af" fontSize="11" fontFamily="Inter, sans-serif">报告 B</text>
        <text x="625" y="214" textAnchor="middle" fill={PURPLE} fontSize="10" fontFamily="Inter, sans-serif">● 独立输出</text>

        {/* Model C - bottom center */}
        <rect x="305" y="380" width="190" height="100" rx="12" fill="url(#modelGrad1)" stroke={PURPLE} strokeWidth="1.5" strokeOpacity="0.5" />
        <text x="400" y="418" textAnchor="middle" fill="white" fontSize="14" fontWeight="600" fontFamily="Inter, sans-serif">LLM C</text>
        <text x="400" y="438" textAnchor="middle" fill="#9ca3af" fontSize="11" fontFamily="Inter, sans-serif">报告 C</text>
        <text x="400" y="454" textAnchor="middle" fill={PURPLE} fontSize="10" fontFamily="Inter, sans-serif">● 独立输出</text>

        {/* Central cross-validation hub */}
        <circle cx={cx} cy={cy} r="58" fill="url(#hubGrad1)" stroke={CYAN} strokeWidth="2" filter="url(#glow1)" />
        <text x={cx} y={cy - 6} textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif">交叉</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="Inter, sans-serif">验证</text>

        {/* Arrows from models to hub */}
        {/* A → hub */}
        <path d="M 270 190 Q 340 190 360 250" stroke={PURPLE} strokeWidth="1.5" fill="none" strokeOpacity="0.4" strokeDasharray="6,3" markerEnd="url(#arrowPurple)" />
        {/* B → hub */}
        <path d="M 530 190 Q 460 190 440 250" stroke={PURPLE} strokeWidth="1.5" fill="none" strokeOpacity="0.4" strokeDasharray="6,3" />
        {/* C → hub */}
        <path d="M 400 380 L 400 360" stroke={PURPLE} strokeWidth="1.5" fill="none" strokeOpacity="0.4" strokeDasharray="6,3" />

        {/* Arrow marker */}
        <defs>
          <marker id="arrowPurple" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill={PURPLE} opacity="0.5" />
          </marker>
        </defs>

        {/* Output section */}
        <rect x="290" y="485" width="220" height="65" rx="30" fill="url(#outputGrad1)" stroke={CYAN} strokeWidth="1" strokeOpacity="0.6" />
        <text x={cx} y="516" textAnchor="middle" fill="white" fontSize="14" fontWeight="600" fontFamily="Inter, sans-serif">✅ 可信结论</text>
        <text x={cx} y="536" textAnchor="middle" fill="#9ca3af" fontSize="10" fontFamily="Inter, sans-serif">3/3 共识 · 反调者验证通过</text>

        {/* Hub → output arrow */}
        <path d={`M ${cx} ${cy + 58} L ${cx} 485`} stroke={CYAN} strokeWidth="1.5" fill="none" strokeOpacity="0.5" />

        {/* Decorative particles */}
        <circle cx="120" cy="480" r="3" fill={CYAN} opacity="0.2" />
        <circle cx="680" cy="200" r="2" fill={PURPLE} opacity="0.3" />
        <circle cx="700" cy="450" r="4" fill={CYAN} opacity="0.15" />
      </svg>
    </div>
  )
}
