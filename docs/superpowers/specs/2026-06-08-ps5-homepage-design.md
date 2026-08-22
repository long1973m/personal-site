# PS5 风格个人主页设计文档

## 项目概述

一个模仿 PS5 主菜单风格的个人主页，展示用户的工作研究项目。深色背景配合缓慢流动的紫蓝渐变光晕粒子，中央是横向滚动的卡片网格，具有玻璃态（glassmorphism）材质效果和流畅的 spring 动画。

## 技术栈

- **构建工具**：Vite
- **框架**：React 18 + TypeScript
- **样式**：Tailwind CSS
- **动画**：Framer Motion
- **粒子效果**：Canvas API
- **部署**：Vercel

## 用户信息

- **昵称**：工藤同学
- **头像**：`/Users/mare/Downloads/ChatGPT Image 2026年6月8日 22_10_35.png`（压缩为 WebP）

## 色彩方案（经典 PS5 风格）

- **背景色**：`#0a0a1a`（深蓝黑）
- **主色调**：`#6b46c1`（紫色）
- **辅色调**：`#06b6d4`（青色）
- **霓虹光晕**：紫色 + 青色渐变
- **文字色**：白色 + 半透明白色

## 组件设计

### 1. ParticleBackground（粒子背景）

- 全屏 Canvas 绘制
- 50-80 个粒子缓慢流动
- 粒子颜色：紫色到青色渐变
- 粒子大小：2-6px，带模糊效果
- 运动轨迹：缓慢漂浮，有轻微的引力效果
- 性能优化：requestAnimationFrame，粒子数量自适应屏幕大小

### 2. CardGrid（卡片容器）

- **桌面端**：横向滚动，居中显示
- **移动端**：纵向滚动
- 支持鼠标滚轮切换卡片
- 支持左右方向键切换
- 当前选中卡片居中显示

### 3. ProjectCard（项目卡片）

- **尺寸**：宽 320px，高 400px（桌面端）
- **材质**：玻璃态（backdrop-filter: blur + 半透明背景）
- **内容**：
  - 封面图（来自 picsum.photos 占位）
  - 项目名称（粗体）
  - 简短描述（2 行以内）
  - 标签（可选）
- **选中状态**：
  - 微微放大（scale 1.05）
  - 霓虹边框光晕（紫色 + 青色）
  - 更强的玻璃态效果
- **动画**：Framer Motion spring 动画，stiffness: 300, damping: 30

### 4. UserProfile（用户卡片）

- **位置**：右上角
- **内容**：
  - 圆形头像（WebP 格式，80x80px）
  - 昵称「工藤同学」
  - 简短标签（如 "Developer" 或 "Creator"）
- **材质**：玻璃态，与卡片风格统一
- **动画**：入场时从右侧滑入

### 5. BackgroundBlur（背景模糊）

- 当选中项目变化时，背景显示该项目封面的低透明度模糊版本
- 过渡动画：淡入淡出，duration 0.5s
- 模糊强度：blur(20px)

## 数据结构

### Project（项目卡片）

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  link?: string;
  tags?: string[];
}
```

### Note（笔记卡片）

```typescript
interface Note {
  id: string;
  title: string;
  summary: string;
  category: string;
  tags?: string[];
  source?: string;
}
```

占位项目数据：6 个 picsum.photos 随机图，后续替换为真实内容。

## 内容规划（来自 Notion）

### 项目区（3 个）

| 项目 | Notion 来源 | 一句话亮点 | 状态 |
|------|-------------|-----------|------|
| **Pi Agent 产品拆解** | `Pi Agent 产品级拆解项目` | 以 Pi.dev 为样本，搞懂极简 agent 的产品取舍逻辑，计划公开发文 | ✅ 已确认 |
| **Agent Loop 工程研究** | 记忆工程 + Loop 系列笔记 | Loop Engineering 本质是记忆工程——当 agent 从单次对话走向长时间循环，瓶颈不再是 prompt 而是记忆 | ✅ 已确认 |
| **财务健康评分模型** | `财务健康度评分模型（Financial Health Score）` | 用 akshare 财报数据构建企业财务健康评分，LLM 输出风险报告，是"所有风险模型的母模型" | ✅ 已确认 |

### 笔记区（规划中）

从 Notion 知识库和工作笔记中精选，包括但不限于：
- STORM 研究方法
- SQL 查询优化实战
- ETL/ELT 数据管道全流程
- AI Coding Agent 成本优化指南
- spec 数据分析（DAU 下滑诊断案例）
- 茶饮行业分析

### 数据来源策略

- **不直接连接 Notion API 实时读取**
- 改为：从 Notion 笔记中提炼亮点，整理为静态 JSON 数据文件
- 内容安全可控，修改只需更新 JSON

## 交互流程

1. **页面加载**：
   - 粒子背景立即开始动画
   - 用户卡片从右侧滑入
   - 卡片网格从下方淡入

2. **卡片切换**：
   - 鼠标滚轮 → 切换到下一张/上一张
   - 左右方向键 → 同上
   - 当前卡片放大 + 霓虹边框
   - 背景模糊替换为当前项目封面

3. **响应式**：
   - 桌面端（>768px）：横向滚动
   - 移动端（<=768px）：纵向滚动，卡片全宽

## 项目结构

```
ps5-homepage/
├── public/
│   └── avatar.webp          # 压缩后的头像
├── src/
│   ├── components/
│   │   ├── ParticleBackground.tsx
│   │   ├── CardGrid.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── UserProfile.tsx
│   │   └── BackgroundBlur.tsx
│   ├── data/
│   │   └── projects.json
│   ├── hooks/
│   │   └── useKeyboardNavigation.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 性能考虑

- 粒子数量自适应屏幕大小（移动端减少）
- 使用 requestAnimationFrame 优化动画
- 图片懒加载
- Tailwind CSS 自动清理未使用样式

## 当前版本状态

**v0.1 — 已完成**（2026-06-10 评审）

- ✅ 粒子背景、卡片网格、用户头像、背景模糊五个核心组件全部到位
- ✅ 桌面端横向滚轮/键盘导航 + 移动端纵向滑动两套交互
- ✅ 玻璃拟态 + 霓虹辉光 + Framer Motion spring 动画
- ✅ Web Audio API 点击/悬停音效
- ✅ Page Visibility API 暂停粒子，滚轮防抖锁
- ⚠️ 内容全是占位数据（picsum.photos 随机图）
- ⚠️ 卡片选中后无"进入详情"动作
- ⚠️ 缺少顶部系统栏、Hero 区域、错误兜底
- ⚠️ BackgroundBlur 双重加载图片（颜色提取 + CSS background 各一次）

---

## 产品路线图 v1.0

### 第一期：核心体验闭环（优先级 P0）

目标：让页面成为一个可用的个人主页，补完交互闭环。

#### 1. 顶部系统栏（PS5 Control Center）

- 新增 `ControlBar` 组件，固定顶部
- 左侧：实时时钟（日期 + 时间）
- 右侧：通知铃铛图标（带红点 badge）+ 设置/主题切换入口
- 半透明毛玻璃底，`glass` 风格统一
- z-index 保持在粒子之上、不挡卡片

#### 2. 卡片"进入"交互 — 项目详情面板

- 选中态下双击或按 Enter → 项目详情展开
- 动画：卡片从当前位置放大到全屏/大面板 → 展示详情内容
- 详情面板内容：大封面图、完整描述、技术栈列表、GitHub/线上地址链接、返回按钮
- 返回时反向缩放动画回到卡片原位置
- 这是 PS5 体感的"灵魂"交互

#### 3. 移动端体验修复

- 移动端改为水平单卡片滑动（一张占 80% 屏宽，左右露出相邻边缘）
- 居中卡片自动放大为选中态，类似 App Store Today 卡片
- 保留 snap scroll 手感
- 移除当前的纵向列表模式

#### 4. ErrorBoundary + 图片兜底

- 全局 `ErrorBoundary` 组件，崩溃时展示降级 UI
- `ProjectCard` 封面加载失败 → 显示带项目首字母的渐变色块 fallback
- 给 `UserProfile` 头像也加 fallback（首字母圆圈）

#### 5. BackgroundBlur 性能修复

- 颜色提取与背景展示复用同一个 `Image` 对象，消除双重加载
- 提取结果用 `Map<string, string>` 缓存，避免切换回来时重新计算

---

### 第二期：信息架构补齐（优先级 P1）

目标：丰富信息密度，让个人主页名副其实。此阶段可与 Notion 内容准备同步推进。

#### 6. Hero 区域

- 在"我的项目"标题上方新增 hero 区块
- 居中大头像（比右上角小卡片的大一圈）
- 昵称 + 一行 Slogan/个人简介
- 技能/身份标签行（如「AI × 产品 × 设计」），胶囊标签样式
- 社交链接图标行（GitHub / Email / Twitter / Blog）

#### 7. 分区导航

- 项目卡片不是全部——增加锚点或 Tab 切换
- 分区：「关于」「项目」「博客/工具」（按实际内容定）
- 导航形式：PS5 风格的下方 Tab 栏或侧边图标列
- 默认展示"项目"分区

#### 8. Footer 补全

- 改为非固定定位，跟随内容自然滚动到底
- 内容：版权信息、Build with 技术栈、社交链接
- 不再显示操作提示（操作提示放到首次加载的引导 overlay 中）

---

### 第三期：上线前收尾（优先级 P1）

目标：打通"灌内容 → 构建 → 部署"的完整链路，把页面变成一个真正能发出去的主页。

#### 15. 集中配置文件 `profile.json` ✅

当前个人信息散落在 App.tsx、ControlBar、Hero、About、Footer 各处，全是硬编码。抽出到统一配置文件。

- 新建 `src/data/profile.json`，包含所有用户信息字段
- 数据结构覆盖：nickname、avatarUrl、slogan、tags、socialLinks、about 段落、focusTopics、tools 列表
- App.tsx 从 profile.json 导入，通过 props 分发给 ControlBar、Hero、About、Tools
- Footer 的版权名和技术栈也由此驱动
- 后续只需改一个 JSON 文件即可完成全部内容更新

#### 16. SEO meta 标签 ✅

当前 `index.html` 没有任何 `<meta>` 标签，社交分享预览卡是空的。

- 在 `index.html` `<head>` 中添加：
  - `<meta name="description">` — 页面摘要
  - `<meta name="keywords">` — 关键词
  - `<meta property="og:title">` / `og:description` / `og:image` — Open Graph
  - `<meta name="twitter:card">` — Twitter 卡片
  - `<link rel="canonical">` — 规范链接
- og:image 使用头像或一张截图，放入 `public/` 目录
- 内容与 `profile.json` 保持一致

#### 17. 内容灌入

从 Notion 笔记中提炼亮点，整理为静态 JSON 数据文件，替换当前占位内容。

- **项目区**（`projects.json`）：3 个已确认项目
  - Pi Agent 产品拆解 — 从 Notion 提取核心亮点和标签
  - Agent Loop 工程研究 — 整合记忆工程 + 多篇 Loop 笔记
  - 财务健康评分模型 — 提取模型思路和亮点

- **笔记区**（新建 `notes.json`）：精选知识库笔记，后续逐步补充

- 封面图使用项目相关截图或设计稿，放入 `public/` 或使用外部 CDN URL
- 个人真实信息填入 `profile.json`

#### 18. 构建验证 + 部署

- 运行 `vite build` 确认 TypeScript 编译无报错
- 检查构建产物大小，确认无意外依赖膨胀
- 本地 `vite preview` 验证效果
- 部署到 Vercel（或用户选定的平台）
- 部署后验证社交分享预览卡正常显示

---

### 第四期：视觉质感提升（优先级 P2.5）✅

目标：在功能完整的基础上，用几个低投入高回报的视觉手段大幅提升整体质感。此期可与 SEO 配置、内容灌入并行推进。

#### 11. 粒子连线——背景氛围感质变 ✅ ✅

当前粒子是孤立的光点。增加粒子间连线逻辑，让背景更有"网络感"和深度。

- 每帧遍历粒子对，距离小于阈值（约 120px）的画一条半透明连线
- 连线透明度与距离成反比：越近越亮，越远越淡
- 连线颜色取两粒子 hue 的中间值，保持紫青渐变协调
- 移动端阈值缩小（约 80px）以减少计算量
- 改动范围：仅 `ParticleBackground.tsx`

#### 12. 光标驱动粒子——让页面"响应你" ✅

粒子当前完全无视鼠标，增加光标附近的粒子偏转，让页面有"被触碰"的反馈感。

- 全局追踪鼠标位置（throttle 至 30ms）
- 粒子经过光标一定半径（约 100px）内时，速度被轻微推离
- 推力大小与距离成反比，不要过猛——类似水面被轻触的涟漪感
- 移动端跳过此逻辑（无鼠标），或用触摸事件替代（可选）
- 改动范围：仅 `ParticleBackground.tsx`

#### 13. 卡片到详情面板的共享元素动画 ✅

当前卡片点击后详情面板从画面中间弹出，缺少"同一元素膨胀"的连贯感。利用 Framer Motion `layoutId` 做共享元素过渡。

- 给 `ProjectCard` 封面 `<img>` 和 `ProjectDetail` 封面 `<img>` 设置同一个 `layoutId`
- Framer Motion 自动计算两张图之间的形变路径（位置、大小、圆角）
- 切换时卡片封面"飞"到详情面板位置，关闭时飞回
- 需要 `AnimatePresence` 包裹，且两层共享元素不同时渲染
- 这是 PS5 风格的"灵魂帧"交互
- 改动范围：`ProjectCard.tsx`、`ProjectDetail.tsx`、`App.tsx`

#### 14. 微细节锦上添花 ✅

三项小改动，独立执行，不分先后：

**14a. 背景扫描线 ✅**

- 在 `index.css` 中用 body 伪元素叠加一层极淡的 repeating-linear-gradient
- 透明度 0.02～0.03，肉眼几乎注意不到
- 潜意识增强"屏幕化"质感

**14b. About 内容交错入场 ✅**

- `About.tsx` 当前是整块淡入，改为子元素 stagger 依次出现
- 与 `Tools.tsx` 现有的 stagger 动画风格统一
- 标题 → 段落 1 → 段落 2 → 段落 3 → 标签行 → 联系方式

**14c. 卡片选中态微 3D 倾斜 ✅**

- 给 `ProjectCard` 容器加 CSS `perspective`
- 选中态下根据鼠标在卡片上的相对位置，微调 `rotateX`/`rotateY`（±2～3 度）
- 鼠标离开时平滑恢复平面
- 给卡片增加被"光照"到的立体感

---

## 执行建议（给 opencode）

- 严格按编号顺序执行，每项只动一个组件
- 每完成一项就预览确认，不在同一轮改多个文件
- 第一期（1-5）：核心体验闭环 → 已完成 ✅
- 第二期（6-8）：信息架构补齐 → 已完成 ✅
- 第三期（15-18）：上线前收尾 → 进行中
  - 15（profile.json）→ 已完成 ✅
  - 16（SEO）→ 已完成 ✅
  - 17（内容灌入）→ 内容已评估，3 项目已确认，待从 Notion 提炼 + 编码实现
  - 18（构建验证 + 部署）→ 最后一步
- 第四期（11-14）：视觉质感提升 → 已完成 ✅

---

### 后续开发计划

**第 1 步：替换项目内容**
- 从 Notion 读取 3 个确认项目的详细内容
- 提炼亮点摘要，组装为 projects.json 的真实数据
- 找合适的封面图（截图或设计稿）

**第 2 步：新增笔记专区**
- 新建 `notes.json`
- 新增 Notes 组件 + NotesCard 组件
- 在 SidebarNav 和 MobileTabBar 新增「📝 笔记」Tab

**第 3 步：构建验证 + 部署**
- `vite build` → 修复 TS 报错 → 上线 Vercel
