import { Client } from '@notionhq/client'
import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_DIR = resolve(__dirname, '../src/data')

const notion = new Client({
  auth: process.env.NOTION_API_TOKEN,
})

const PAGE_ID = '54c049f4-7c72-4270-8bb5-3d9e44cb1edd'
const CV_PAGE_ID = '50abcecf-8e2b-4231-9134-fe16737fb43f'
const BLOG_PAGE_ID = 'e49aa987-1de9-4588-a529-cf4cf5ac5e04'

// 每个案例的展示元数据（标签 / 主题色 / 封面组件 / 流程图），按页面标题前缀匹配
const PROJECT_META: Record<string, { tags: string[]; accentColor: string; coverComponent: string; flowDiagram: string }> = {
  'Case Study 1': { tags: ['竞品分析', '多模型交叉验证', '幻觉检测'], accentColor: '#7c3aed', coverComponent: 'CaseStudy1Cover', flowDiagram: 'FlowDiagram1' },
  'Case Study 2': { tags: ['Skill 架构', '模块化设计', '保险科技'], accentColor: '#06b6d4', coverComponent: 'CaseStudy2Cover', flowDiagram: 'FlowDiagram2' },
  'Case Study 3': { tags: ['数据工程', 'QA 清洗', '微调数据质量'], accentColor: '#6366f1', coverComponent: 'CaseStudy3Cover', flowDiagram: 'FlowDiagram3' },
  'Case Study 4': { tags: ['B 端产品', '配置化架构', '风险管理'], accentColor: '#14b8a6', coverComponent: 'CaseStudy4Cover', flowDiagram: 'FlowDiagram4' },
  'Case Study 5': { tags: ['Data Agent', 'NL2SQL', '知识工程'], accentColor: '#3b82f6', coverComponent: 'CaseStudy5Cover', flowDiagram: 'FlowDiagram5' },
}

function getText(block: any): string {
  const content = block[block.type]
  if (!content?.rich_text) return ''
  return content.rich_text.map((rt: any) => rt.plain_text).join(' ').trim()
}

async function fetchAll(blockId: string): Promise<any[]> {
  const blocks: any[] = []
  let cursor: string | undefined
  while (true) {
    const res: any = await notion.blocks.children.list({ block_id: blockId, start_cursor: cursor, page_size: 100 })
    blocks.push(...res.results)
    if (!res.has_more) break
    cursor = res.next_cursor!
  }
  return blocks
}

async function main() {
  console.log('Fetching Notion data...')
  mkdirSync(DATA_DIR, { recursive: true })

  const blocks = await fetchAll(PAGE_ID)

  // === Profile ===
  const paragraphs: string[] = []
  const focusTopics: string[] = []
  const interests: string[] = []
  let aboutQuote = ''
  let contactEmail = ''
  let contactKaggle = ''

  const colList = blocks.find((b: any) => b.type === 'column_list')
  if (colList) {
    const cols = await fetchAll(colList.id)
    for (const col of cols) {
      if (col.type !== 'column') continue
      const items = await fetchAll(col.id)
      let section = ''
      for (const item of items) {
        const text = getText(item)
        if (!text) continue
        if (item.type === 'heading_3') {
          section = text
        } else if (item.type === 'bulleted_list_item') {
          if (section.includes('核心能力')) focusTopics.push(text)
          else if (section.includes('当前关注')) interests.push(text)
        }
      }
    }
  }

  for (const b of blocks) {
    const text = getText(b)
    if (!text) continue
    if (b.type === 'paragraph') paragraphs.push(text)
    else if (b.type === 'quote' && !aboutQuote) aboutQuote = text
    else if (b.type === 'bulleted_list_item') {
      if (text.startsWith('Email')) contactEmail = text.replace(/^Email\s*[：:]\s*/, '').trim()
      else if (text.startsWith('Kaggle')) contactKaggle = text
    }
  }

  const cvBlocks = await fetchAll(CV_PAGE_ID)
  const cvSections: { title: string; items: string[] }[] = []
  let currentSection: string | null = null
  for (const b of cvBlocks) {
    const text = getText(b)
    if (b.type === 'heading_2' && text) {
      currentSection = text.replace(/[👤🎯💼🛠️📂]/g, '').trim()
      cvSections.push({ title: currentSection, items: [] })
    } else if ((b.type === 'paragraph' || b.type === 'bulleted_list_item' || b.type === 'quote') && text && currentSection) {
      cvSections[cvSections.length - 1].items.push(text)
    }
  }

  const profile = {
    nickname: 'Mare',
    avatarUrl: '/avatar.webp',
    slogan: aboutQuote || '用 AI 解决真实业务问题',
    tags: focusTopics,
    socialLinks: [
      { name: 'GitHub', url: 'https://github.com/long1973m', icon: 'github' },
      ...(contactEmail ? [{ name: 'Email', url: `mailto:${contactEmail}`, icon: 'email' }] : []),
    ],
    about: { paragraphs, focusTopics, interests, cvSections, contact: contactEmail ? `Email: ${contactEmail}` : '' },
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite', 'Notion API', 'Python'],
    copyright: 'Mare · 二度空间',
  }
  writeFileSync(resolve(DATA_DIR, 'profile.json'), JSON.stringify(profile, null, 2))
  console.log('  ✓ profile.json')

  // === Projects ===
  const caseStudies = blocks.filter((b: any) => b.type === 'child_page' && (getText(b) || b.child_page?.title || '').startsWith('Case Study'))
  const projects = []
  for (const cs of caseStudies) {
    const title = cs.child_page?.title || getText(cs) || 'Untitled'
    const csBlocks = await fetchAll(cs.id)
    const detailLines: string[] = []
    for (const b of csBlocks) {
      const text = getText(b)
      if (!text) continue
      if (b.type === 'paragraph') detailLines.push(text)
      else if (b.type === 'callout') detailLines.unshift(text)
      else if (b.type === 'bulleted_list_item') detailLines.push(`• ${text}`)
      else if (b.type === 'numbered_list_item') detailLines.push(`1. ${text}`)
    }
    const metaKey = Object.keys(PROJECT_META).find((k) => title.startsWith(k))
    const meta = metaKey ? PROJECT_META[metaKey] : null
    projects.push({
      id: cs.id.replace(/-/g, '').slice(0, 12),
      title,
      description: detailLines[0]?.slice(0, 150) || title,
      detailDescription: detailLines.join('\n\n'),
      coverImage: `https://picsum.photos/seed/${cs.id.slice(0, 8)}/800/600`,
      tags: meta ? meta.tags : ['AI', '数据分析', '产品设计'],
      github: '',
      link: '',
      ...(meta ? { accentColor: meta.accentColor, coverComponent: meta.coverComponent, flowDiagram: meta.flowDiagram } : {}),
    })
  }
  writeFileSync(resolve(DATA_DIR, 'projects.json'), JSON.stringify(projects, null, 2))
  console.log(`  ✓ projects.json (${projects.length} projects)`)

  // === Notes ===
  const blogBlocks = await fetchAll(BLOG_PAGE_ID)
  const notes: any[] = []
  let cur: any = null
  const cats: Record<string, string> = { '置顶文章': 'AI Agent', '方法论沉淀': '数据分析', '工具与效率': '工程实践', '行业观察': '行业研究' }
  let cat = 'AI Agent'
  for (const b of blogBlocks) {
    const text = getText(b)
    if (b.type === 'heading_2') {
      if (cur) { notes.push({ ...cur, id: `note-${notes.length + 1}` }); cur = null }
      const key = text.replace(/[📌🔬🛠️📊]/g, '').trim()
      cat = cats[key] || cat
    } else if (b.type === 'heading_3' && text) {
      if (cur) notes.push({ ...cur, id: `note-${notes.length + 1}` })
      cur = { title: text, summary: '', category: cat }
    } else if (b.type === 'paragraph' && cur && text) {
      if (!cur.summary) cur.summary = text.slice(0, 200)
    }
  }
  if (cur) notes.push({ ...cur, id: `note-${notes.length + 1}` })
  writeFileSync(resolve(DATA_DIR, 'notes.json'), JSON.stringify(notes, null, 2))
  console.log(`  ✓ notes.json (${notes.length} notes)`)

  // === meta.json ===
  writeFileSync(resolve(DATA_DIR, 'meta.json'), JSON.stringify({
    avatarUrl: '/avatar.webp',
    copyright: 'Mare · 二度空间',
  }, null, 2))
  console.log('  ✓ meta.json\nDone!')
}

// Notion 源不可用（如页面归档/网络失败）时优雅降级：保留现有 src/data 文件，不阻塞构建
main().catch(err => {
  console.warn(`⚠ Notion 数据源不可用（${err?.body?.message || err?.message || err}），保留现有 src/data 文件`)
})
