/**
 * 背景风格注册表：每个风格 = 一组图层开关与参数的组合
 * 新增风格只需在 BACKGROUND_STYLES 加一项，App 与设置面板自动生效
 */

export type AuroraIntensity = 'off' | 'subtle' | 'normal' | 'enhanced'
export type ParticleHue = 'default' | 'cyan'

export interface BackgroundLayers {
  particles: boolean
  density: number            // 粒子密度倍率
  particleHue: ParticleHue   // 星点色相：default=蓝紫粉 / cyan=青蓝
  aurora: AuroraIntensity
  gridFloor: boolean
  gridEnhanced: boolean      // 赛博网格增强态
  mouseGlow: boolean
  nebula: boolean            // 纯 CSS 星云层（低功耗）
  scan: number               // 扫描线透明度
  noise: number              // 噪点透明度
}

export interface BackgroundStyle {
  id: string
  name: string
  desc: string
  preview: string            // 设置面板预览色块的 CSS 背景
  layers: BackgroundLayers
}

export const DEFAULT_BACKGROUND_ID = 'deep-space'
const STORAGE_KEY = 'ps5-background'

export function getStoredBackgroundId(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_BACKGROUND_ID
  } catch {
    return DEFAULT_BACKGROUND_ID
  }
}

export function storeBackgroundId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, id)
  } catch {
    // 隐私模式下忽略
  }
}

export const BACKGROUND_STYLES: BackgroundStyle[] = [
  {
    id: 'deep-space',
    name: '深空星域',
    desc: '粒子星空 · 流星 · 极光 · 网格地面',
    preview: 'linear-gradient(135deg, #0a0a1a 0%, #2d1b69 55%, #06b6d4 100%)',
    layers: { particles: true, density: 1, particleHue: 'default', aurora: 'normal', gridFloor: true, gridEnhanced: false, mouseGlow: true, nebula: false, scan: 0.4, noise: 0.035 },
  },
  {
    id: 'aurora-flow',
    name: '极光流域',
    desc: '饱和光带缓慢流动，静谧沉浸',
    preview: 'linear-gradient(135deg, #12082a 0%, #6b46c1 55%, #06b6d4 100%)',
    layers: { particles: false, density: 0, particleHue: 'default', aurora: 'enhanced', gridFloor: false, gridEnhanced: false, mouseGlow: true, nebula: false, scan: 0.25, noise: 0.03 },
  },
  {
    id: 'cyber-grid',
    name: '赛博网格',
    desc: '增强网格与扫描线，硬核科技感',
    preview: 'linear-gradient(135deg, #020617 0%, #164e63 60%, #22d3ee 100%)',
    layers: { particles: true, density: 0.5, particleHue: 'cyan', aurora: 'subtle', gridFloor: true, gridEnhanced: true, mouseGlow: true, nebula: false, scan: 0.55, noise: 0.04 },
  },
  {
    id: 'nebula',
    name: '静谧星云',
    desc: '纯 CSS 星云漂移，低功耗友好',
    preview: 'linear-gradient(135deg, #0a0a1a 0%, #312e81 45%, #7c3aed 80%, #db2777 100%)',
    layers: { particles: false, density: 0, particleHue: 'default', aurora: 'subtle', gridFloor: false, gridEnhanced: false, mouseGlow: false, nebula: true, scan: 0.2, noise: 0.03 },
  },
  {
    id: 'minimal',
    name: '极简暗夜',
    desc: '关闭全部特效，专注内容阅读',
    preview: 'linear-gradient(135deg, #0a0a1a 0%, #16162e 100%)',
    layers: { particles: false, density: 0, particleHue: 'default', aurora: 'off', gridFloor: false, gridEnhanced: false, mouseGlow: false, nebula: false, scan: 0.12, noise: 0.02 },
  },
]
