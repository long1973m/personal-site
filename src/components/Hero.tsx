import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

interface HeroProps {
  nickname: string
  avatarUrl: string
  slogan: string
  tags: string[]
  socialLinks: {
    name: string
    url: string
    icon: string
  }[]
}

const iconMap: Record<string, JSX.Element> = {
  github: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  ),
  email: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  twitter: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  blog: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  ),
}

/** 打字机：按码点切分（兼容 emoji），尊重 prefers-reduced-motion */
function useTypewriter(text: string, speed = 40, startDelay = 900) {
  const [count, setCount] = useState(0)
  const chars = useMemo(() => Array.from(text), [text])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(chars.length)
      return
    }
    let i = 0
    let interval: number | undefined
    const timer = window.setTimeout(() => {
      interval = window.setInterval(() => {
        i += 1
        setCount(i)
        if (i >= chars.length && interval !== undefined) {
          window.clearInterval(interval)
        }
      }, speed)
    }, startDelay)
    return () => {
      window.clearTimeout(timer)
      if (interval !== undefined) window.clearInterval(interval)
    }
  }, [chars, speed, startDelay])

  return { typed: chars.slice(0, count).join(''), done: count >= chars.length }
}

export default function Hero({ nickname, avatarUrl, slogan, tags, socialLinks }: HeroProps) {
  const { typed, done } = useTypewriter(slogan)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="text-center mb-16 px-4"
    >
      {/* Avatar — 旋转渐变光环 + 悬浮呼吸 */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
        className="mb-6"
      >
        <div className="relative w-28 h-28 md:w-36 md:h-36 mx-auto animate-float-y">
          {/* 光环本体 + 模糊光晕（同步旋转） */}
          <div className="absolute -inset-1.5 rounded-full avatar-ring opacity-90" aria-hidden="true" />
          <div className="absolute -inset-1.5 rounded-full avatar-ring blur-lg opacity-50" aria-hidden="true" />
          <img
            src={avatarUrl}
            alt={nickname}
            className="absolute inset-0 w-full h-full rounded-full object-cover ring-4 ring-ps5-dark"
          />
        </div>
      </motion.div>

      {/* Nickname — 流光渐变字 */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-4xl md:text-5xl font-bold mb-3 gradient-text-animated hero-title-glow"
      >
        {nickname}
      </motion.h1>

      {/* Slogan — 打字机效果 */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-gray-400 text-lg md:text-xl mb-6 max-w-md mx-auto min-h-[1.75em]"
      >
        {typed}
        {!done && <span className="typewriter-cursor" aria-hidden="true" />}
      </motion.p>

      {/* Tags */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap justify-center gap-3 mb-8"
      >
        {tags.map((tag) => (
          <span
            key={tag}
            className="px-4 py-2 rounded-full text-sm font-medium bg-ps5-purple/30 text-ps5-cyan border border-ps5-cyan/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-ps5-cyan/15 hover:border-ps5-cyan/60 hover:shadow-[0_0_18px_rgba(6,182,212,0.35)] cursor-default"
          >
            {tag}
          </span>
        ))}
      </motion.div>

      {/* Social Links */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex justify-center gap-4"
      >
        {socialLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl glass hover-glow"
            aria-label={link.name}
          >
            {iconMap[link.icon]}
          </a>
        ))}
      </motion.div>
    </motion.div>
  )
}
