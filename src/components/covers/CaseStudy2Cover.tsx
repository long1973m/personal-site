// 保险场景 Skill 化架构设计 — 封面信息图
// 水平流水线：5 个 Skill 方块从分析层到决策层

const PURPLE = '#6b46c1'
const CYAN = '#06b6d4'

export default function CaseStudy2Cover({ className }: { className?: string }) {
  const w = 800, h = 600

  return (
    <div className={`w-full h-full ${className ?? ''}`}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0a0a1a" />
            <stop offset="100%" stopColor="#12082a" />
          </linearGradient>
          <linearGradient id="anaGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={PURPLE} stopOpacity="0.55" />
            <stop offset="100%" stopColor={PURPLE} stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="decGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={CYAN} stopOpacity="0.55" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="inGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={PURPLE} stopOpacity="0.35" />
            <stop offset="100%" stopColor={CYAN} stopOpacity="0.35" />
          </linearGradient>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width={w} height={h} fill="url(#bg2)" rx="12" />

        {/* Subtle diagonal lines */}
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={`diag-${i}`} x1={i * 70} y1="0" x2={i * 70 + 100} y2={h} stroke="white" strokeWidth="0.5" opacity="0.025" />
        ))}

        {/* Title */}
        <text x="400" y="50" textAnchor="middle" fill="white" fontSize="18" fontWeight="700" fontFamily="Inter, sans-serif">
          Skill 化架构
        </text>
        <text x="400" y="70" textAnchor="middle" fill="#9ca3af" fontSize="13" fontFamily="Inter, sans-serif">
          业务拆解 → 模块化落地 → 跨场景复用
        </text>

        {/* Input arrow from left */}
        <text x="40" y="215" fill="#9ca3af" fontSize="11" fontFamily="Inter, sans-serif" textAnchor="start">场景输入</text>
        <line x1="105" y1="210" x2="140" y2="210" stroke={CYAN} strokeWidth="1.5" strokeOpacity="0.4" />

        {/* Skill 1 - Analysis Layer (purple) */}
        <rect x="145" y="165" width="100" height="90" rx="10" fill="url(#anaGrad)" stroke={PURPLE} strokeWidth="1.2" strokeOpacity="0.5" />
        <text x="195" y="198" textAnchor="middle" fill="white" fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif">Skill 1</text>
        <text x="195" y="216" textAnchor="middle" fill="#9ca3af" fontSize="10" fontFamily="Inter, sans-serif">信息提取</text>
        <text x="195" y="234" textAnchor="middle" fill={PURPLE} fontSize="9" fontFamily="Inter, sans-serif">LLM</text>

        {/* Arrow 1→2 */}
        <line x1="245" y1="210" x2="275" y2="210" stroke={PURPLE} strokeWidth="1.5" strokeOpacity="0.4" />

        {/* Skill 2 */}
        <rect x="280" y="165" width="100" height="90" rx="10" fill="url(#anaGrad)" stroke={PURPLE} strokeWidth="1.2" strokeOpacity="0.5" />
        <text x="330" y="198" textAnchor="middle" fill="white" fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif">Skill 2</text>
        <text x="330" y="216" textAnchor="middle" fill="#9ca3af" fontSize="10" fontFamily="Inter, sans-serif">合规校验</text>
        <text x="330" y="234" textAnchor="middle" fill={PURPLE} fontSize="9" fontFamily="Inter, sans-serif">规则引擎</text>

        {/* Arrow 2→3 */}
        <line x1="380" y1="210" x2="410" y2="210" stroke={PURPLE} strokeWidth="1.5" strokeOpacity="0.4" />

        {/* Skill 3 */}
        <rect x="415" y="165" width="100" height="90" rx="10" fill="url(#anaGrad)" stroke={PURPLE} strokeWidth="1.2" strokeOpacity="0.5" />
        <text x="465" y="198" textAnchor="middle" fill="white" fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif">Skill 3</text>
        <text x="465" y="216" textAnchor="middle" fill="#9ca3af" fontSize="10" fontFamily="Inter, sans-serif">条款匹配</text>
        <text x="465" y="234" textAnchor="middle" fill={PURPLE} fontSize="9" fontFamily="Inter, sans-serif">LLM+RAG</text>

        {/* Arrow 3→4 */}
        <line x1="515" y1="210" x2="545" y2="210" stroke="white" strokeWidth="1" strokeOpacity="0.2" />

        {/* Zone label - Analysis Layer */}
        <rect x="160" y="265" width="340" height="22" rx="11" fill={PURPLE} fillOpacity="0.15" stroke={PURPLE} strokeWidth="0.5" strokeOpacity="0.3" />
        <text x="330" y="280" textAnchor="middle" fill={PURPLE} fontSize="10" fontFamily="Inter, sans-serif" fontWeight="600">分析层 Analysis Layer</text>

        {/* Arrow 3→4 (connecting line with transition color) */}
        <path d="M 515 210 L 545 210" stroke={CYAN} strokeWidth="1.5" strokeOpacity="0.3" />

        {/* Skill 4 - Decision Layer (cyan) */}
        <rect x="550" y="165" width="100" height="90" rx="10" fill="url(#decGrad)" stroke={CYAN} strokeWidth="1.2" strokeOpacity="0.5" />
        <text x="600" y="198" textAnchor="middle" fill="white" fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif">Skill 4</text>
        <text x="600" y="216" textAnchor="middle" fill="#9ca3af" fontSize="10" fontFamily="Inter, sans-serif">综合推理</text>
        <text x="600" y="234" textAnchor="middle" fill={CYAN} fontSize="9" fontFamily="Inter, sans-serif">LLM</text>

        {/* Arrow 4→5 */}
        <line x1="650" y1="210" x2="680" y2="210" stroke={CYAN} strokeWidth="1.5" strokeOpacity="0.4" />

        {/* Skill 5 */}
        <rect x="685" y="165" width="85" height="90" rx="10" fill="url(#decGrad)" stroke={CYAN} strokeWidth="1.2" strokeOpacity="0.5" />
        <text x="728" y="198" textAnchor="middle" fill="white" fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif">Skill 5</text>
        <text x="728" y="216" textAnchor="middle" fill="#9ca3af" fontSize="10" fontFamily="Inter, sans-serif">责任判定</text>
        <text x="728" y="234" textAnchor="middle" fill={CYAN} fontSize="9" fontFamily="Inter, sans-serif">LLM</text>

        {/* Zone label - Decision Layer */}
        <rect x="560" y="265" width="200" height="22" rx="11" fill={CYAN} fillOpacity="0.15" stroke={CYAN} strokeWidth="0.5" strokeOpacity="0.3" />
        <text x="660" y="280" textAnchor="middle" fill={CYAN} fontSize="10" fontFamily="Inter, sans-serif" fontWeight="600">决策层 Decision Layer</text>

        {/* Output arrow */}
        <line x1="770" y1="210" x2="800" y2="210" stroke={CYAN} strokeWidth="1.5" strokeOpacity="0.4" />
        <text x="780" y="235" fill="#9ca3af" fontSize="11" fontFamily="Inter, sans-serif" textAnchor="end">责任初判</text>

        {/* Bottom info - key design principles */}
        <rect x="100" y="340" width="600" height="190" rx="14" fill="white" fillOpacity="0.03" stroke="white" strokeWidth="0.5" strokeOpacity="0.08" />

        <text x="140" y="375" fill="white" fontSize="12" fontWeight="600" fontFamily="Inter, sans-serif">设计原则</text>

        {/* Principle 1 */}
        <circle cx="150" cy="400" r="4" fill={CYAN} opacity="0.5" />
        <text x="165" y="404" fill="#9ca3af" fontSize="11" fontFamily="Inter, sans-serif">单一职责 — 每个 Skill 只做一件事</text>

        {/* Principle 2 */}
        <circle cx="150" cy="425" r="4" fill={CYAN} opacity="0.5" />
        <text x="165" y="429" fill="#9ca3af" fontSize="11" fontFamily="Inter, sans-serif">Schema 契约 — JSON Schema 定义输入/输出，松耦合</text>

        {/* Principle 3 */}
        <circle cx="150" cy="450" r="4" fill={CYAN} opacity="0.5" />
        <text x="165" y="454" fill="#9ca3af" fontSize="11" fontFamily="Inter, sans-serif">类型明确 — 每个 Skill 归入 LLM / 规则 / RAG 之一</text>

        {/* Principle 4 */}
        <circle cx="150" cy="475" r="4" fill={CYAN} opacity="0.5" />
        <text x="165" y="479" fill="#9ca3af" fontSize="11" fontFamily="Inter, sans-serif">可独立部署 — 单项更新不影响上下游</text>

        {/* Principle 5 */}
        <circle cx="150" cy="500" r="4" fill={CYAN} opacity="0.5" />
        <text x="165" y="504" fill="#9ca3af" fontSize="11" fontFamily="Inter, sans-serif">可组合 — Skill 自由组合适配不同客户场景</text>

        {/* Decorative */}
        <circle cx="720" cy="520" r="5" fill={PURPLE} opacity="0.15" />
        <circle cx="50" cy="550" r="8" fill={CYAN} opacity="0.08" />
        <circle cx="700" cy="80" r="3" fill={CYAN} opacity="0.2" />
        <circle cx="100" cy="100" r="2" fill={PURPLE} opacity="0.3" />
      </svg>
    </div>
  )
}
