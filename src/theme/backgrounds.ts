/**
 * 背景风格注册表：每个风格 = 底色基调 + 一组图层开关与参数的组合
 * 新增风格只需在 BACKGROUND_STYLES 加一项，App 与设置面板自动生效
 *
 * base: 页面根节点的 CSS 背景（决定整个风格的基调色）
 * glow: 鼠标光晕颜色（hex，仅 mouseGlow 开启时生效）
 */

export type AuroraIntensity = 'off' | 'subtle' | 'normal' | 'enhanced'
export type AuroraPalette = 'cool' | 'warm' | 'ice' | 'rose'
export type ParticleHue = 'default' | 'cyan' | 'warm' | 'rose'

export interface BackgroundLayers {
  particles: boolean
  density: number            // 粒子密度倍率
  particleHue: ParticleHue   // 星点色相
  aurora: AuroraIntensity
  auroraPalette: AuroraPalette
  gridFloor: boolean
  gridEnhanced: boolean      // 赛博网格增强态
  mouseGlow: boolean
  nebula: boolean            // 纯 CSS 星云层（低功耗）
  sun: boolean               // 复古条纹落日（合成波）
  matrix: boolean            // 数字雨画布
  snow: boolean              // 极夜飘雪画布
  petals: boolean            // 樱花瓣画布
  scan: number               // 扫描线透明度
  noise: number              // 噪点透明度
}

export interface BackgroundStyle {
  id: string
  name: string
  desc: string
  preview: string            // 设置面板预览色块的 CSS 背景
  base: string               // 页面根背景（基调色）
  glow?: string              // 鼠标光晕颜色（hex）
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
    base: 'linear-gradient(160deg, #0a0a1a 0%, #0c0c22 55%, #12082a 100%)',
    glow: '#7c5cff',
    layers: { particles: true, density: 1, particleHue: 'default', aurora: 'normal', auroraPalette: 'cool', gridFloor: true, gridEnhanced: false, mouseGlow: true, nebula: false, sun: false, matrix: false, snow: false, petals: false, scan: 0.4, noise: 0.035 },
  },
  {
    id: 'synthwave',
    name: '霓虹日落',
    desc: '复古落日 · 合成波网格 · 暖调星野',
    preview: 'linear-gradient(to bottom, #12081f 0%, #5b1470 55%, #ff6b35 100%)',
    base: 'linear-gradient(to bottom, #140822 0%, #2b0f3a 42%, #57145f 68%, #7e1e56 84%, #93305a 100%)',
    glow: '#ff901f',
    layers: { particles: true, density: 0.7, particleHue: 'warm', aurora: 'subtle', auroraPalette: 'warm', gridFloor: true, gridEnhanced: false, mouseGlow: true, nebula: false, sun: true, matrix: false, snow: false, petals: false, scan: 0.5, noise: 0.03 },
  },
  {
    id: 'matrix',
    name: '数字雨',
    desc: '绿色字符瀑布 · 终端美学',
    preview: 'linear-gradient(135deg, #010402 0%, #071009 60%, #37d95e 100%)',
    base: 'radial-gradient(ellipse at center, #081209 0%, #030905 75%)',
    glow: '#37d95e',
    layers: { particles: false, density: 0, particleHue: 'default', aurora: 'off', auroraPalette: 'cool', gridFloor: false, gridEnhanced: false, mouseGlow: true, nebula: false, sun: false, matrix: true, snow: false, petals: false, scan: 0.38, noise: 0.05 },
  },
  {
    id: 'snowfall',
    name: '极夜飘雪',
    desc: '景深雪幕 · 冰蓝雾霭 · 安静冬夜',
    preview: 'linear-gradient(170deg, #0b1626 0%, #182c4d 70%, #a5d8ff 100%)',
    base: 'linear-gradient(175deg, #0b1626 0%, #101f38 58%, #1a2f52 100%)',
    glow: '#7dd3fc',
    layers: { particles: false, density: 0, particleHue: 'default', aurora: 'subtle', auroraPalette: 'ice', gridFloor: false, gridEnhanced: false, mouseGlow: true, nebula: false, sun: false, matrix: false, snow: true, petals: false, scan: 0.18, noise: 0.03 },
  },
  {
    id: 'sakura',
    name: '绯樱之夜',
    desc: '樱花瓣旋转飘落 · 暖粉夜色',
    preview: 'linear-gradient(150deg, #170a12 0%, #331222 60%, #fb7185 100%)',
    base: 'linear-gradient(165deg, #170a12 0%, #250d1c 55%, #361325 100%)',
    glow: '#fb7185',
    layers: { particles: true, density: 0.35, particleHue: 'rose', aurora: 'subtle', auroraPalette: 'rose', gridFloor: false, gridEnhanced: false, mouseGlow: true, nebula: false, sun: false, matrix: false, snow: false, petals: true, scan: 0.15, noise: 0.03 },
  },
  {
    id: 'aurora-flow',
    name: '极光流域',
    desc: '饱和光带缓慢流动，静谧沉浸',
    preview: 'linear-gradient(135deg, #12082a 0%, #6b46c1 55%, #06b6d4 100%)',
    base: 'linear-gradient(160deg, #0c0518 0%, #140a2e 60%, #1a0d38 100%)',
    glow: '#06b6d4',
    layers: { particles: false, density: 0, particleHue: 'default', aurora: 'enhanced', auroraPalette: 'cool', gridFloor: false, gridEnhanced: false, mouseGlow: true, nebula: false, sun: false, matrix: false, snow: false, petals: false, scan: 0.25, noise: 0.03 },
  },
  {
    id: 'cyber-grid',
    name: '赛博网格',
    desc: '增强网格与扫描线，硬核科技感',
    preview: 'linear-gradient(135deg, #020617 0%, #164e63 60%, #22d3ee 100%)',
    base: 'linear-gradient(165deg, #020617 0%, #04121f 60%, #062033 100%)',
    glow: '#06b6d4',
    layers: { particles: true, density: 0.5, particleHue: 'cyan', aurora: 'subtle', auroraPalette: 'cool', gridFloor: true, gridEnhanced: true, mouseGlow: true, nebula: false, sun: false, matrix: false, snow: false, petals: false, scan: 0.55, noise: 0.04 },
  },
  {
    id: 'nebula',
    name: '静谧星云',
    desc: '纯 CSS 星云漂移，低功耗友好',
    preview: 'linear-gradient(135deg, #0a0a1a 0%, #312e81 45%, #7c3aed 80%, #db2777 100%)',
    base: 'linear-gradient(150deg, #0a0a1a 0%, #171233 50%, #221040 100%)',
    layers: { particles: false, density: 0, particleHue: 'default', aurora: 'subtle', auroraPalette: 'cool', gridFloor: false, gridEnhanced: false, mouseGlow: false, nebula: true, sun: false, matrix: false, snow: false, petals: false, scan: 0.2, noise: 0.03 },
  },
  {
    id: 'minimal',
    name: '极简暗夜',
    desc: '关闭全部特效，专注内容阅读',
    preview: 'linear-gradient(135deg, #0a0a1a 0%, #16162e 100%)',
    base: 'linear-gradient(170deg, #09091a 0%, #101024 100%)',
    layers: { particles: false, density: 0, particleHue: 'default', aurora: 'off', auroraPalette: 'cool', gridFloor: false, gridEnhanced: false, mouseGlow: false, nebula: false, sun: false, matrix: false, snow: false, petals: false, scan: 0.12, noise: 0.02 },
  },
]
