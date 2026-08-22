import { useCallback, useRef } from 'react'

interface UseSoundOptions {
  volume?: number
  enabled?: boolean
}

export function useSound(options: UseSoundOptions = {}) {
  const { volume = 0.3, enabled = true } = options
  const audioContextRef = useRef<AudioContext | null>(null)

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return audioContextRef.current
  }, [])

  const playClick = useCallback(() => {
    if (!enabled) return

    try {
      const ctx = getAudioContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      // Short, crisp click sound
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(800, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.05)

      gainNode.gain.setValueAtTime(volume * 0.5, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.08)
    } catch (e) {
      // Silently fail if audio context is not available
    }
  }, [enabled, volume, getAudioContext])

  const playHover = useCallback(() => {
    if (!enabled) return

    try {
      const ctx = getAudioContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      // Soft, subtle hover sound
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(600, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.1)

      gainNode.gain.setValueAtTime(volume * 0.2, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.1)
    } catch (e) {
      // Silently fail if audio context is not available
    }
  }, [enabled, volume, getAudioContext])

  return { playClick, playHover }
}
