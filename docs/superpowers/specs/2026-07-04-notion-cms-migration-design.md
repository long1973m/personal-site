# Notion CMS 迁移设计

## 概述

将 PS5 风格个人主页的数据源从静态 JSON 迁移为 Notion API 构建时拉取，实现「Notion 写内容 → 构建生成 → 静态部署」的 CMS 工作流。

## 架构

```
Notion API (Mare's Portfolio)
       ↓
scripts/fetch-notion-data.ts  (构建时运行)
       ↓
src/data/*.json  ← 文件格式完全兼容现有组件
       ↓
React 组件 (不变)
```

关键原则：**零改动现有组件** — 数据源替换后 import 路径不变，只改数据内容。

## 内容映射

### Notion 页面 → PS5 数据文件

| Notion 内容 | 目标 JSON | 映射方式 |
|---|---|---|
| page title "Mare's Portfolio" | `profile.json` → `nickname` | 静态提取 |
| About Me (heading + paragraph + quote) | `profile.json` → `about.paragraphs[]` | 文本拼接 |
| 定位 - 核心能力 (column 1) | `profile.json` → `about.focusTopics` | 列表提取 |
| 定位 - 当前关注 (column 2) | `profile.json` → 新增 `about.interests[]` | 列表提取 |
| CV - 基本信息 / 个人定位 / 核心能力 / 技术栈 | `profile.json` → 新增 `about.cv` 结构 | 结构化提取 |
| 联系方式 | `profile.json` → `socialLinks` | 邮箱 + GitHub 增量 |
| Case Study 子页面 × 3 | `projects.json` | 每篇提取 title/description/detail/tags |
| Blog & Notes 文章段落 | `notes.json` | 提取 heading 为 title，paragraph 为 summary |
| Tools (Notion 无此内容) | 移除 `profile.json` → `tools` | **Tab 移除** |

### 需保留的静态元数据 (`src/data/meta.json`)

```json
{
  "avatarUrl": "/avatar.webp",
  "copyright": "工藤同学 · 二度空间",
  "slogan": "AI Agent × 产品 × 数据 — 在技术与设计的交汇处探索"
}
```

这些内容 Notion 里没有对应字段，保留最小静态文件。

## 组件变更

### 无变动的组件
- `CardGrid` / `ProjectCard` / `ProjectDetail` — 数据格式不变
- `Hero` — props 接口不变
- `Notes` / `NotesCard` — 数据格式不变
- `ParticleBackground` / `BackgroundBlur` / `ControlBar` — 无关
- `Footer` — props 接口不变

### 需变更的组件

**App.tsx** — 仅修改 import：
- `projects` → 仍从 `./data/projects.json` import（来源变了，路径不变）
- `notes` → 同上
- `profile` → 同上
- `tools` → 移除 Tools Tab 及其 import

**About.tsx** — 扩展展示能力：
- 接收 CV 数据（可选 props）
- 展示「定位」两列（核心能力 / 当前关注）
- 展示「个人定位」quote

**SidebarNav.tsx / MobileTabBar.tsx** — Tab 选项：
- 移除 `tools` Tab
- 保持 3 个 Tab: `about`, `projects`, `notes`

## 提取脚本

### `scripts/fetch-notion-data.ts`

使用 `@notionhq/client`（已安装），构建时运行。

```typescript
// 伪代码流程
async function fetchAll() {
  const page = await notion.pages.retrieve(PORTFOLIO_PAGE_ID)
  const blocks = await notion.blocks.children.list(PORTFOLIO_PAGE_ID)

  // 1. 提取 profile 信息
  const profile = extractProfile(blocks)

  // 2. 提取项目子页面
  const caseStudyPages = blocks.filter(b => b.type === 'child_page' && b.title?.startsWith('Case Study'))
  const projects = await Promise.all(
    caseStudyPages.map(fetchCaseStudyPage)
  )

  // 3. 提取 Blog & Notes
  const blogBlocks = await notion.blocks.children.list(BLOG_PAGE_ID)
  const notes = extractNotes(blogBlocks)

  // 4. 提取 CV
  const cv = await extractCV(CV_PAGE_ID)

  // 写入 JSON
  writeJSON('src/data/profile.json', { ...profile, cv })
  writeJSON('src/data/projects.json', projects)
  writeJSON('src/data/notes.json', notes)
  writeJSON('src/data/meta.json', meta)
}
```

### Notion API 使用范围
使用的 API 端点（均已有 access）：
- `GET /v1/pages/{id}` — 页面元数据
- `GET /v1/blocks/{id}/children` — 页面内容
- `GET /v1/databases/{id}/query` — 可选，Blog 如果用 database

### 环境变量
- `NOTION_API_TOKEN` — 已配置，构建时读取
- `NOTION_PORTFOLIO_PAGE_ID` — `54c049f4-7c72-4270-8bb5-3d9e44cb1edd`

## 构建流程

```json
// package.json 新增脚本
{
  "scripts": {
    "dev": "vite",
    "build:data": "tsx scripts/fetch-notion-data.ts",
    "build": "npm run build:data && vite build",
    "build:all": "npm run build"
  }
}
```

使用 `tsx` 直接跑 TypeScript 脚本（项目已有 TypeScript 配置）。

## Notion 约定

脚本对 Notion 页面内容做以下约定：

| Notion 元素 | 解析规则 |
|---|---|
| `heading_2/3` | 作为标题/分段标识 |
| `paragraph` | 作为正文内容 |
| `bulleted_list_item` | 作为列表项 |
| `quote` | 作为引用/标注 |
| `child_page` 标题含 "Case Study" | 作为项目卡片 |
| `child_page` 标题含 "Blog" | 作为笔记文章入口 |
| `child_page` "CV & 能力说明" | 作为简历数据 |
| `column_list` + `column` | 作为侧边并列内容 |

## 项目状态（迁移后需补充）

目前 PS5 项目的 `projects.json` 中有 3 个完整项目（Pi Agent、Agent Loop、Financial Health），而 Notion 的 Case Study 是 3 个不同的项目。最终 `projects.json` 将以 **Notion 的 3 个 Case Study 为准**。

现有 3 个项目的数据如想保留，可考虑迁移到 Notion 博客笔记中，不做自动迁移。
