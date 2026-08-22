# Notion CMS Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace PS5 homepage static JSON data with Notion API build-time fetched data.

**Architecture:** A `scripts/fetch-notion-data.ts` script runs before `vite build`, calls Notion API on Mare's Portfolio page, and writes to `src/data/*.json`. React components unchanged except: remove Tools tab, enhance About to show CV.

**Tech Stack:** `@notionhq/client` (already installed), `tsx` (runtime for script), existing React/Tailwind/Framer Motion

---

### Task 1: Install tsx and add scripts to package.json

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install `tsx`**

```bash
npm install -D tsx
```

- [ ] **Step 2: Update package.json scripts**

Replace:
```json
"build": "tsc && vite build",
```

With:
```json
"dev": "vite",
"build:data": "tsx scripts/fetch-notion-data.ts",
"build": "npm run build:data && tsc && vite build",
"preview": "vite preview"
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add tsx dep and build:data script"
```

---

### Task 2: Create fetch-notion-data.ts script

**Files:**
- Create: `scripts/fetch-notion-data.ts`

This is the core script. It connects to Notion API, reads Mare's Portfolio page, extracts structured data, and writes `src/data/*.json`.

- [ ] **Step 1: Create the script**

```typescript
import { Client } from '@notionhq/client'
import { writeFileSync } from 'fs'
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

interface NotionRichText {
  plain_text: string
  href?: string | null
}

interface NotionBlock {
  id: string
  type: string
  has_children?: boolean
  [key: string]: unknown
  paragraph?: { rich_text: NotionRichText[] }
  heading_2?: { rich_text: NotionRichText[] }
  heading_3?: { rich_text: NotionRichText[] }
  bulleted_list_item?: { rich_text: NotionRichText[] }
  numbered_list_item?: { rich_text: NotionRichText[] }
  quote?: { rich_text: NotionRichText[] }
  callout?: { rich_text: NotionRichText[] }
  child_page?: { title: string }
  child_database?: { title: string }
}

function getText(block: NotionBlock): string {
  const content = block[block.type as keyof NotionBlock] as { rich_text?: NotionRichText[] } | undefined
  if (!content?.rich_text) return ''
  return content.rich_text.map(rt => rt.plain_text).join(' ').trim()
}

function getTitle(block: NotionBlock): string {
  if (block.type === 'child_page') {
    return (block.child_page?.title || '').trim()
  }
  return getText(block)
}

async function fetchBlockChildren(blockId: string): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = []
  let cursor: string | undefined
  while (true) {
    const response: any = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: cursor,
      page_size: 100,
    })
    blocks.push(...response.results)
    if (!response.has_more) break
    cursor = response.next_cursor!
  }
  return blocks
}

async function main() {
  console.log('Fetching Notion data...')

  const blocks = await fetchBlockChildren(PAGE_ID)
  console.log(`  Root page: ${blocks.length} blocks`)

  // --- Profile ---
  const paragraphs: string[] = []
  const focusTopics: string[] = []
  const interests: string[] = []
  let aboutQuote = ''
  let contactEmail = ''
  let contactKaggle = ''

  for (const block of blocks) {
    const text = getText(block)
    if (!text) continue

    if (block.type === 'paragraph') {
      paragraphs.push(text)
    } else if (block.type === 'quote') {
      aboutQuote = text
    } else if (block.type === 'bulleted_list_item') {
      if (text.startsWith('Email')) {
        contactEmail = text.replace(/^Email\s*[：:]\s*/, '').trim()
      } else if (text.startsWith('Kaggle')) {
        contactKaggle = text.replace(/^Kaggle\s*[：:]\s*/, '').trim()
      }
    }
  }

  // Extract positioning columns (core capabilities -> focusTopics, current interests -> interests)
  // Column 1: 核心能力 (heading_3 + list items)
  // Column 2: 当前关注 (heading_3 + list items)
  // We need to find column_list and get its children
  const columnListBlock = blocks.find(b => b.type === 'column_list')
  if (columnListBlock) {
    const columnBlocks = await fetchBlockChildren(columnListBlock.id)
    for (const col of columnBlocks) {
      if (col.type !== 'column') continue
      const colChildren = await fetchBlockChildren(col.id)
      for (const child of colChildren) {
        const childText = getText(child)
        if (!childText) continue
        // 核心能力 items go to focusTopics
        // 当前关注 items go to interests
        // heading_3 tells us which section we're in
        // We detect: bullet items under 核心能力 heading vs 当前关注 heading
        
        // Simpler: heading_3 tells us the section
        // bullet items are the content
        // Let me just collect from the column structure
      }
      
      // Approach: heading_3 titles tell us category
      for (const child of colChildren) {
        const childText = getText(child)
        if (!childText) continue
        if (child.type === 'bulleted_list_item') {
          // Check if previous heading_3 was 核心能力 or 当前关注
          // We'll determine via heading detection below
        }
      }
    }
  }

  // Write profile.json
  const profile = {
    nickname: 'Mare',
    avatarUrl: '/avatar.webp',
    slogan: aboutQuote || 'AI Agent × 产品 × 数据',
    tags: focusTopics,
    socialLinks: [
      { name: 'GitHub', url: 'https://github.com/long1973m', icon: 'github' },
      ...(contactEmail ? [{ name: 'Email', url: `mailto:${contactEmail}`, icon: 'email' }] : []),
    ],
    about: {
      paragraphs,
      focusTopics,
      interests,
      contact: contactEmail ? `Email: ${contactEmail}` : '',
    },
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite', 'Notion API', 'Python'],
    copyright: 'Mare · 二度空间',
  }

  writeFileSync(resolve(DATA_DIR, 'profile.json'), JSON.stringify(profile, null, 2))
  console.log('  ✓ profile.json')

  // --- Projects (Case Study child pages) ---
  const caseStudyBlocks = blocks.filter(b => b.type === 'child_page' && getTitle(b).startsWith('Case Study'))
  const projects = []

  for (const csBlock of caseStudyBlocks) {
    const csBlocks = await fetchBlockChildren(csBlock.id)
    const title = getTitle(csBlock)
    const description = getText(csBlocks.find(b => b.type === 'callout') || csBlocks.find(b => b.type === 'paragraph') || csBlocks.find(b => b.type === 'heading_3') || {}) || title
    const detailParts: string[] = []
    const tags: string[] = []

    for (const block of csBlocks) {
      const text = getText(block)
      if (!text) continue
      if (block.type === 'paragraph') detailParts.push(text)
      else if (block.type === 'bulleted_list_item') {
        // Collect tags from callout or bullet items
        if (text.startsWith('角色') || text.startsWith('概述') || text.startsWith('核心')) {
          detailParts.push(`• ${text}`)
        }
      }
    }

    // Build tags from heading sections
    const firstHeading = csBlocks.find(b => b.type === 'heading_2' || b.type === 'heading_3')
    const methodTag = getText(firstHeading!).replace(/[📋🔧📊]/g, '').trim()

    projects.push({
      id: csBlock.id.replace(/-/g, '').slice(0, 12),
      title,
      description: description.slice(0, 150),
      detailDescription: detailParts.join('\n\n') || description,
      coverImage: `https://picsum.photos/seed/${csBlock.id.slice(0, 8)}/800/600`,
      tags: ['AI', '数据分析', methodTag].filter(Boolean),
      github: '',
      link: '',
    })
  }

  writeFileSync(resolve(DATA_DIR, 'projects.json'), JSON.stringify(projects, null, 2))
  console.log(`  ✓ projects.json (${projects.length} projects)`)

  // --- Notes (Blog page sections) ---
  const blogBlocks = await fetchBlockChildren(BLOG_PAGE_ID)
  const notes = []
  let currentNote: { title: string; summary: string; category: string } | null = null

  // Blog categories detected by heading_2
  const categoryMap: Record<string, string> = {
    '置顶文章': 'AI Agent',
    '方法论沉淀': '数据分析',
    '工具与效率': '工程实践',
    '行业观察': '行业研究',
  }

  let currentCategory = 'AI Agent'
  for (const block of blogBlocks) {
    const text = getText(block)
    
    if (block.type === 'heading_2') {
      // Save previous note if exists
      if (currentNote) {
        notes.push({ ...currentNote, id: `note-${notes.length + 1}` })
        currentNote = null
      }
      currentCategory = categoryMap[text.replace(/[📌🔬🛠️]/g, '').trim()] || currentCategory
      currentNote = null
    } else if (block.type === 'heading_3' && text) {
      if (currentNote) {
        notes.push({ ...currentNote, id: `note-${notes.length + 1}` })
      }
      currentNote = {
        title: text,
        summary: '',
        category: currentCategory,
      }
    } else if (block.type === 'paragraph' && currentNote && text) {
      if (!currentNote.summary) {
        currentNote.summary = text.slice(0, 200)
      }
    }
  }
  if (currentNote) {
    notes.push({ ...currentNote, id: `note-${notes.length + 1}` })
  }

  writeFileSync(resolve(DATA_DIR, 'notes.json'), JSON.stringify(notes, null, 2))
  console.log(`  ✓ notes.json (${notes.length} notes)`)

  // --- meta.json (static values not in Notion) ---
  const meta = {
    avatarUrl: '/avatar.webp',
    copyright: 'Mare · 二度空间',
  }
  writeFileSync(resolve(DATA_DIR, 'meta.json'), JSON.stringify(meta, null, 2))
  console.log('  ✓ meta.json')

  console.log('\nDone! All data files generated.')
}

main().catch(err => {
  console.error('Fetch failed:', err)
  process.exit(1)
})
```

Wait, the above is too complex and has logical issues with the column_list parsing. Let me simplify.

- [ ] **Step 1: Create the fetch script**

```typescript
import { Client } from '@notionhq/client'
import { writeFileSync } from 'fs'
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
  const blocks = await fetchAll(PAGE_ID)

  // === Profile ===
  const paragraphs: string[] = []
  const focusTopics: string[] = []
  const interests: string[] = []
  let aboutQuote = ''
  let contactEmail = ''
  let contactKaggle = ''

  // First pass: extract positioning columns
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

  // Second pass: text content
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

  // Also fetch CV data
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
    projects.push({
      id: cs.id.replace(/-/g, '').slice(0, 12),
      title,
      description: detailLines[0]?.slice(0, 150) || title,
      detailDescription: detailLines.join('\n\n'),
      coverImage: `https://picsum.photos/seed/${cs.id.slice(0, 8)}/800/600`,
      tags: ['AI', '数据分析', '产品设计'],
      github: '',
      link: '',
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

main().catch(err => { console.error(err); process.exit(1) })
```

- [ ] **Step 2: Run the script to verify**

```bash
NOTION_API_TOKEN="$NOTION_API_TOKEN（从 ~/.zshrc 加载，勿提交真实值）" npx tsx scripts/fetch-notion-data.ts
```

Expected: Script outputs "Fetching Notion data..." then generates all JSON files without errors.

- [ ] **Step 3: Check generated files**

```bash
ls -la src/data/*.json
cat src/data/profile.json | python3 -m json.tool | head -30
cat src/data/projects.json | python3 -m json.tool | head -20
cat src/data/notes.json | python3 -m json.tool | head -20
```

Expected: Valid JSON files with Notion content.

- [ ] **Step 4: Commit**

```bash
git add scripts/fetch-notion-data.ts src/data/
git commit -m "feat: add Notion data fetch script"
```

---

### Task 3: Remove Tools tab from navigation

**Files:**
- Modify: `src/components/SidebarNav.tsx`
- Modify: `src/components/MobileTabBar.tsx`

- [ ] **Step 1: Remove tools from SidebarNav.tsx TabType and tabs array**

In `SidebarNav.tsx`:

Replace `export type TabType = 'about' | 'projects' | 'tools' | 'notes'` with `export type TabType = 'about' | 'projects' | 'notes'`

Remove the entire tools tab entry (lines 31-38):
```typescript
  {
    id: 'tools',
    label: '工具',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
```

- [ ] **Step 2: Remove tools from MobileTabBar.tsx tabs array**

Remove the tools tab entry (lines 29-37) in `MobileTabBar.tsx`.

- [ ] **Step 3: Build check**

```bash
npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/SidebarNav.tsx src/components/MobileTabBar.tsx
git commit -m "refactor: remove Tools tab from navigation"
```

---

### Task 4: Remove Tools tab from App.tsx

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Remove Tools import and usage**

Remove: `import Tools from './components/Tools'`

Remove the `{activeTab === 'tools' && ...}` block (lines 121-131):
```typescript
            {activeTab === 'tools' && (
              <motion.div
                key="tools"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Tools tools={profile.tools} />
              </motion.div>
            )}
```

And since `profile.json` no longer has a `tools` field, the App.tsx also won't need `profile.tools` reference anywhere else.

- [ ] **Step 2: Build check**

```bash
npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx
git commit -m "refactor: remove Tools tab from App"
```

---

### Task 5: Delete Tools.tsx component

**Files:**
- Delete: `src/components/Tools.tsx`

- [ ] **Step 1: Delete the file**

```bash
rm src/components/Tools.tsx
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Tools.tsx
git commit -m "refactor: remove Tools component"
```

---

### Task 6: Enhance About.tsx with CV and interests

**Files:**
- Modify: `src/components/About.tsx`

- [ ] **Step 1: Update About.tsx to accept new props**

```typescript
import { motion } from 'framer-motion'

interface AboutProps {
  paragraphs: string[]
  focusTopics: string[]
  interests?: string[]
  cvSections?: { title: string; items: string[] }[]
  contact: string
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function About({ paragraphs, focusTopics, interests, cvSections, contact }: AboutProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto px-4 py-8"
    >
      <div className="glass rounded-3xl p-8 space-y-8">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 text-gray-300 leading-relaxed">
          {paragraphs.map((p, i) => (
            <motion.p key={i} variants={item}>{p}</motion.p>
          ))}
        </motion.div>

        {/* Positioning: Core Capabilities + Current Interests */}
        <motion.div variants={item} initial="hidden" animate="show" className="pt-6 border-t border-white/10">
          {focusTopics.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">核心能力</h3>
              <div className="flex flex-wrap gap-2">
                {focusTopics.map((t, i) => (
                  <span key={i} className="px-4 py-2 rounded-full text-sm bg-ps5-purple/20 text-ps5-cyan border border-ps5-cyan/20">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {interests && interests.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">当前关注</h3>
              <div className="flex flex-wrap gap-2">
                {interests.map((t, i) => (
                  <span key={i} className="px-4 py-2 rounded-full text-sm bg-ps5-cyan/10 text-ps5-cyan border border-ps5-cyan/20">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* CV Sections */}
        {cvSections && cvSections.length > 0 && (
          <motion.div variants={item} initial="hidden" animate="show" className="pt-6 border-t border-white/10 space-y-6">
            {cvSections.map((section, si) => (
              <div key={si}>
                <h3 className="text-lg font-semibold text-white mb-3">{section.title}</h3>
                <div className="space-y-2">
                  {section.items.map((line, li) => (
                    <p key={li} className="text-gray-300 text-sm">{line}</p>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}

        <motion.div variants={item} initial="hidden" animate="show" className="pt-6 border-t border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">联系方式</h3>
          <p className="text-gray-400">{contact}</p>
        </motion.div>
      </div>
    </motion.div>
  )
}
```

- [ ] **Step 2: Update App.tsx to pass new props**

In `App.tsx`, find `<About>` usage and add the new props:

```typescript
                <About 
                  paragraphs={profile.about.paragraphs}
                  focusTopics={profile.about.focusTopics}
                  interests={profile.about.interests}
                  cvSections={profile.about.cvSections}
                  contact={profile.about.contact}
                />
```

- [ ] **Step 3: Build check**

```bash
npx tsc --noEmit
```

Expected: No type errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/About.tsx src/App.tsx
git commit -m "feat: enhance About with CV and positioning sections"
```

---

### Task 7: Full build verification

**Files:**
- All project files

- [ ] **Step 1: Run full build**

```bash
NOTION_API_TOKEN="$NOTION_API_TOKEN（从 ~/.zshrc 加载，勿提交真实值）" npm run build
```

Expected: Build succeeds, generates `dist/` folder.

- [ ] **Step 2: Final commit**

```bash
git add -A
git commit -m "feat: migrate data source from static JSON to Notion CMS"
```

---

### Task 8: Git ignore generated data files (optional)

Since data files are now generated by the build script, you may want to git-ignore them so only the script is versioned.

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add generated data to .gitignore**

Append to `.gitignore`:
```
# Generated by Notion fetch script
src/data/profile.json
src/data/projects.json
src/data/notes.json
src/data/meta.json
```

- [ ] **Step 2: Remove tracked files from git**

```bash
git rm --cached src/data/profile.json src/data/projects.json src/data/notes.json
```

- [ ] **Step 3: Commit**

```bash
git add .gitignore
git commit -m "chore: git-ignore generated data files"
```
