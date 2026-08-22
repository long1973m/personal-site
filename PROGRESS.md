# PS5 风格个人主页 - 开发进度

## 项目信息

- **项目名称**：PS5 风格个人主页
- **项目路径**：`/Users/mare/Projects/personal-site/ps5-homepage_web_20260601`
- **启动命令**：`npm run dev` → http://localhost:5173
- **技术栈**：React 18 + TypeScript + Tailwind CSS + Framer Motion + Vite

---

## 已完成 ✅

### 基础架构
- [x] Vite + React 18 + TypeScript 项目脚手架
- [x] Tailwind CSS 配置（PS5 配色：深蓝底 #0a0a1a、紫色 #6b46c1、青色 #06b6d4）
- [x] PostCSS + Autoprefixer 配置
- [x] 项目目录结构搭建

### 核心组件
- [x] **ParticleBackground** - Canvas 紫蓝渐变粒子背景动画（支持 Page Visibility API 暂停，移动端优化，粒子连线，光标驱动推离）
- [x] **CardGrid** - 横向滚动卡片容器（桌面端）/ 焦点轮播（移动端）
- [x] **ProjectCard** - 玻璃态项目卡片，含封面图、标题、描述、标签（支持图片加载失败兜底，共享元素动画，3D 倾斜）
- [x] **BackgroundBlur** - 选中项目时背景模糊 + 颜色提取 + 加载占位（带缓存，复用 Image 对象）
- [x] **ControlBar** - 顶部系统栏（PS5 Control Center 风格，整合用户信息）
- [x] **ProjectDetail** - 项目详情面板（双击/Enter/Escape 展开/关闭，支持 detailDescription）
- [x] **ErrorBoundary** - 全局错误边界，崩溃时展示降级 UI
- [x] **Hero** - 个人主页首屏区域（头像 + 昵称 + 简介 + 标签 + 社交链接）
- [x] **SidebarNav** - 侧边图标导航（关于/项目/工具/笔记，Hover 显示文字）
- [x] **MobileTabBar** - 移动端底部 Tab 导航
- [x] **About** - 关于页面（个人介绍 + 关注方向）
- [x] **Tools** - 工具页面（常用工具卡片）
- [x] **NotesCard** - 笔记卡片（左侧分类色条，标签，hover 效果）
- [x] **Notes** - 笔记专区页面（stagger 入场，按笔记列表展示）
- [x] **Footer** - 页脚（版权 + 技术栈 + 社交链接，跟随内容滚动）

### 交互功能
- [x] 鼠标滚轮切换卡片（带防抖锁定，500ms 冷却期）
- [x] 左右方向键切换卡片
- [x] 卡片点击选中
- [x] Spring 动画（stiffness: 300, damping: 30）
- [x] 选中卡片放大 1.05x + 呼吸光晕边框（紫-青渐变循环）
- [x] 非选中卡片缩小 0.95x + 透明度 0.6 + 亮度 0.7（景深效果）
- [x] 响应式设计（桌面横排 / 手机横排焦点轮播）
- [x] 移动端水平单卡片滑动（80vw 宽度，snap 吸附）
- [x] 移动端 IntersectionObserver 自动选中居中卡片
- [x] 键盘焦点指示器（选中卡片四角标记 + ring 效果）
- [x] ARIA 无障碍支持（aria-selected, role="button"）
- [x] 音效反馈：切换卡片 "click" 音效 + 悬停 "hover" 音效
- [x] 选中卡片裁切修复（调整位移 + 增加容器间距）
- [x] 卡片双击/Enter 展开详情面板（全屏动画 + 返回逻辑）
- [x] 卡片封面与详情面板共享元素动画（layoutId 飞入飞出）
- [x] About 页面子元素 stagger 交错入场

### 资源处理
- [x] 头像压缩：PNG → WebP（985KB → 8KB）
- [x] 占位项目数据 6 个（使用 picsum.photos 随机图片）
- [x] 网站图标（SVG）

### 视觉效果
- [x] 玻璃态材质（backdrop-filter: blur）
- [x] 粒子背景缓慢流动（移动端简化：更少粒子 + 更慢速度）
- [x] 粒子连线：距离 < 阈值时画半透明连线，增强网络感
- [x] 光标驱动粒子：鼠标附近粒子被轻轻推离，水面涟漪感
- [x] 背景模糊 + 颜色提取（从封面图提取主色调，生成径向渐变）
- [x] 背景加载占位（图片未加载时显示模糊渐变占位，避免闪白）
- [x] 背景扫描线：body::after 叠加极淡横线，潜意识增强屏幕感
- [x] 入场动画（卡片依次淡入）
- [x] 卡片呼吸光晕动画（3秒周期，紫-青渐变循环）
- [x] 卡片 3D 倾斜：perspective + 鼠标驱动 rotateX/rotateY
- [x] 共享元素动画：卡片封面与详情面板 layoutId 过渡
- [x] z-index 层级管理（粒子 z-0 → 背景模糊 z-10 → 内容 z-20）

### 性能优化
- [x] Page Visibility API：标签页隐藏时暂停 RAF 动画，节约 CPU/GPU
- [x] 移动端粒子优化：数量减半（30个），速度减半，尺寸缩小
- [x] Canvas 指针事件禁用（pointer-events-none），确保卡片可交互

---

## 待优化 🔧

### 动画效果
- [ ] 页面加载时的开场动画
- [ ] 卡片切换时的过渡动画更丝滑（进一步优化）

### 视觉细节
- [ ] 粒子颜色渐变更丰富
- [ ] 卡片阴影层次感
- [ ] 滚动条样式美化

### 功能扩展
- [ ] 对接 Notion API 获取真实项目数据
- [ ] 添加项目分类筛选
- [ ] 深色/浅色主题切换（可选）

---

## 文件结构

```
ps5-homepage/
├── public/
│   ├── avatar.webp              # 头像（已压缩）
│   └── vite.svg                 # 网站图标
├── src/
│   ├── components/
│   │   ├── ParticleBackground.tsx   # 粒子背景（连线 + 光标驱动）
│   │   ├── CardGrid.tsx             # 卡片网格容器
│   │   ├── ProjectCard.tsx          # 项目卡片（共享元素 + 3D 倾斜）
│   │   ├── ProjectDetail.tsx        # 项目详情面板（共享元素）
│   │   ├── BackgroundBlur.tsx       # 背景模糊效果（带缓存，复用 Image）
│   │   ├── ControlBar.tsx           # 顶部系统栏（整合用户信息）
│   │   ├── ErrorBoundary.tsx        # 全局错误边界
│   │   ├── Hero.tsx                 # 首屏 Hero 区域
│   │   ├── SidebarNav.tsx           # 侧边图标导航（桌面端）
│   │   ├── MobileTabBar.tsx         # 底部 Tab 导航（移动端）
│   │   ├── About.tsx                # 关于页面（stagger 入场）
│   │   ├── Tools.tsx                # 工具页面（stagger 入场）
│   │   └── Footer.tsx               # 页脚
│   ├── hooks/
│   │   └── useSound.ts              # 音效 Hook
│   ├── data/
│   │   ├── profile.json             # 个人信息配置（统一管理）
│   │   └── projects.json            # 项目数据（占位）
│   ├── App.tsx                      # 主组件
│   ├── main.tsx                     # 入口文件（含 ErrorBoundary）
│   └── index.css                    # 全局样式（含扫描线）
├── docs/
│   └── superpowers/specs/
│       └── 2026-06-08-ps5-homepage-design.md  # 设计文档
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 版本记录

| 日期 | 版本 | 内容 |
|------|------|------|
| 2026-06-08 | v1.0 | 初版完成，基础功能全部实现 |
| 2026-06-09 | v1.1 | 增强视觉效果：景深感、呼吸光晕、背景颜色提取 |
| 2026-06-09 | v1.2 | 交互优化：滚轮防抖、移动端 snap 吸附、键盘焦点指示器 |
| 2026-06-09 | v1.3 | 数据流优化：BackgroundBlur 接收完整项目数据，添加加载占位 |
| 2026-06-09 | v1.4 | 性能优化：Page Visibility API、移动端粒子简化、z-index 层级管理 |
| 2026-06-09 | v1.5 | 音效系统：Web Audio API 生成 click/hover 音效 |
| 2026-06-09 | v1.6 | 修复：选中卡片裁切问题，调整位移和容器间距 |
| 2026-06-10 | v2.0 | 新增 ControlBar 顶部系统栏 |
| 2026-06-10 | v2.1 | 整合 UserProfile 到 ControlBar，统一顶部栏 |
| 2026-06-10 | v2.2 | 灵魂交互：卡片双击/Enter 展开详情面板 |
| 2026-06-10 | v2.3 | 移动端重构：水平焦点轮播（80vw 卡片 + snap 吸附） |
| 2026-06-11 | v2.4 | 键盘体验修复：Escape 关闭详情 + 清理 UserProfile 死代码 |
| 2026-06-11 | v2.5 | 稳定性提升：ErrorBoundary + 图片兜底 + BackgroundBlur 性能修复 |
| 2026-06-11 | v2.6 | 新增 Hero 区域（头像 + 昵称 + 简介 + 标签 + 社交链接） |
| 2026-06-11 | v3.0 | 分区导航：侧边栏 + 关于/项目/工具三个 Tab |
| 2026-06-11 | v3.1 | Footer 补全：跟随内容滚动 + 版权 + 技术栈 + 社交链接 |
| 2026-06-11 | v3.2 | SidebarNav 优化：Hover 时文字从右侧滑出，默认只显示图标 |
| 2026-06-11 | v3.3 | Bug 修复：BackgroundBlur 复用 Image + 移动端 TabBar + 键盘穿透修复 |
| 2026-06-12 | v3.4 | 粒子连线：背景氛围感质变，粒子间距离 < 阈值时画半透明连线 |
| 2026-06-12 | v3.5 | 光标驱动粒子：鼠标附近粒子被轻轻推离，水面涟漪感 |
| 2026-06-12 | v3.6 | 灵魂帧：卡片封面与详情面板共享元素动画（layoutId） |
| 2026-06-12 | v3.7 | 微细节：About stagger 入场 + 卡片 3D 倾斜 + 背景扫描线 |
| 2026-06-12 | v4.0 | 配置集中化：新建 profile.json，统一管理所有个人信息 |
| 2026-06-12 | v4.1 | SEO 优化：添加 Open Graph、Twitter Card、description、canonical |
| 2026-06-21 | v4.2 | 内容规划：从 Notion 评估并确认 3 个真实项目 + 笔记专区规划 |
| 2026-06-21 | v5.0 | 内容灌入 + 笔记专区：替换 projects.json 真实内容，新增 notes.json、NotesCard、Notes 组件和笔记 Tab |
| 2026-07-30 | v6.0 | 视觉大升级：PS5 开机动画 + 极光层 + 合成波网格地面 + 鼠标光晕 + 流星/闪烁粒子 + Hero 流光字/打字机/光环头像 + 卡片 sheen/括号动画/地面反光 + 噪点纹理 |
| 2026-07-30 | v6.1 | 一致性修复：详情面板复用 SVG 封面组件（不再显示 picsum 占位图）、BackgroundBlur 改用 accentColor 主题色（不再从随机图提色）、index.html SEO 更新为 Mare/二度空间身份 |
| 2026-07-30 | v6.2 | 内容扩充：新增 Case Study 4（风险知识库×三档形态配置化架构）与 Case Study 5（Data Agent 语义知识工程），含定制封面信息图与流程图；数据源策略调整——Notion 旧管线三页面已归档，projects.json 升级为权威数据源，fetch 脚本优雅降级不再阻塞构建 |
| 2026-07-30 | v6.3 | 笔记区扩充：从学习区数据库（142 行/74 篇已完成）精选 13 篇 + 保留 2 篇个人向 = 15 篇；启用 NotesCard 的 source/tags 字段；淘汰 3 篇与 Case Study 主题重复的旧笔记 |
| 2026-08-22 | v6.4 | 背景风格系统：设置齿轮接入快捷面板，5 种背景风格（深空星域/极光流域/赛博网格/静谧星云/极简暗夜），localStorage 持久化即时切换；排版优化：笔记双栏+分类筛选、About 两栏 CV 时间线、Footer 技术栈去重、详情字号微调、通知铃铛如实呈现 |

---

## v6.1 一致性修复（2026-07-30）

### 修复内容
1. **详情封面与卡片统一**：`ProjectDetail.tsx` 头图改为复用 `coverComponents` 中与卡片相同的 SVG 信息图（800×600 viewBox + slice 裁切适配宽幅头部）；仅当项目无 `coverComponent` 时回退到 `coverImage` 图片（此时共享元素 layoutId 动画仍然可用）
2. **背景氛围色可控**：`projects.json` 每个项目新增 `accentColor` 字段（CS1 紫 #7c3aed / CS2 青 #06b6d4 / CS3 靛蓝 #6366f1）；`BackgroundBlur.tsx` 重写为直接使用主题色渲染径向渐变，删除了 canvas 主色提取、图片加载与缓存逻辑（约 -80 行），切换项目时交叉淡入淡出
3. **SEO 身份修正**：`index.html` 全部「工藤同学」→ Mare · 二度空间；keywords 更新为实际方法论关键词；移除 example.com 的 canonical/og:url/twitter:url 占位（部署后补充真实域名，文件内留 TODO 注释）；og-image.png 确认存在于 public/

### 附带收益
- 站点运行时不再请求 picsum.photos 外链（除非未来项目无 coverComponent），消除第三方依赖与随机性
- JS 产物 337.69KB → 336.58KB

### 验证
- [x] `tsc --noEmit` 零错误
- [x] `vite build` 成功，dist/index.html 已是 Mare 身份
- [x] dev server 三份修改文件模块变换 200，accentColor 三条数据正确下发

---

## v6.0 视觉大升级（2026-07-30）

### 新增组件
| 组件 | 说明 |
|------|------|
| `BootScreen.tsx` | PS5 开机动画：黑场 → 光束展开 → 昵称流光扫过 → 进度条 → 淡出。点击/按键跳过，sessionStorage 控制每会话只播一次 |
| `AuroraBackground.tsx` | 极光氛围层：三个模糊光斑（紫/青/蓝）缓慢漂移，z-1（粒子画布之上、内容之下） |
| `GridFloor.tsx` | 合成波透视网格地面：Tron 风格地板向观者滚动 + 地平线光带，z-11 |
| `MouseGlow.tsx` | 鼠标跟随光晕：lerp 平滑追随，仅精确指针设备启用，直接操作 style 零重渲染 |

### 增强效果
- **ParticleBackground**：星星正弦闪烁（phase + twinkleSpeed）+ 随机流星（彗尾渐变 + 头部光点，桌面端 4-10s 间隔）+ 色相扩展到蓝→紫→粉
- **Hero**：昵称流光渐变字（gradient-text-animated）+ slogan 打字机（按码点切分兼容 emoji，尊重 prefers-reduced-motion）+ 头像旋转 conic 光环 + 悬浮呼吸 + 标签 hover 辉光
- **ProjectCard**：选中卡片高光扫过（sheen）+ 四角括号入场动画（scale 1.8→1 + 辉光）+ 地面反光（card-floor）+ 选中标题辉光
- **全局**：噪点纹理（body::before，SVG feTurbulence）+ 「我的项目」渐变标题带两侧装饰线 + About/Notes 标题渐变字 + 分页点辉光 + scrollbar-hide 修正

### z-index 层级（v6.0）
粒子 z-0 → 极光 z-1 → 鼠标光晕 z-2 → 背景模糊 z-10 → 网格地面 z-11 → 内容 z-20 → 导航 z-40 → 详情 z-50 → 开机 z-100 → 噪点 9998 → 扫描线 9999

### 无障碍与性能
- `prefers-reduced-motion: reduce` 时关闭所有装饰动画（极光/网格/sheen/光环/打字机等）
- 移动端：极光降模糊降透明度、网格降透明度、鼠标光晕隐藏、流星不生成
- 极光/光晕动画只用 transform（GPU 合成），打字机按码点切分避免 emoji 撕裂

### 验证
- [x] `tsc --noEmit` 零错误
- [x] `vite build` 成功（337KB JS / 29KB CSS）
- [x] dev server 全部模块变换 200

---

## v6.2 内容扩充：Case Study 4 & 5（2026-07-30）

### 新增内容
- **CS4《一套风险知识库 × 三档产品形态 —— B 端平台的配置化架构》**：知识与流程分离、同构裁剪（集团版六阶段/专业店五阶段/小店三阶段）、三条设计红线（AI 不判责/强制项锁定/反哺过人）；主题色青绿 #14b8a6
- **CS5《让模型按口径查数 —— 面向 Data Agent 的语义知识工程》**：NL2SQL 六类坑、分层语义知识包（表卡片/薄指标/Gotchas/术语/黄金SQL/评测负例）、四大工程机制（渐进加载/出口硬约束/输出契约/确认态过时闸）；主题色蓝 #3b82f6
- 两篇均含定制封面信息图（CaseStudy4Cover/5Cover）与流程示意图（FlowDiagram4/5），已注册 CoverMap
- ProjectDetail 长文渲染加 `whitespace-pre-line`，多段 detailDescription 正确换行

### 数据源策略调整
- 发现原 Notion 管线三个源页面（profile/CV/blog）均已被归档进回收站 → Notion 管线事实失效
- `projects.json` 升级为权威数据源（CS4/CS5 以本地条目维护）
- `fetch-notion-data.ts` 两处升级：① 失败时优雅降级（警告并保留现有 data 文件，不再 exit(1) 阻塞构建）② 新增 PROJECT_META 映射（标题前缀 → tags/accentColor/coverComponent/flowDiagram），未来 Notion 恢复后重新抓取也不会丢失展示元数据

### 验证
- [x] `npm run build:data` 优雅降级 ✓（Notion 报错仅警告，数据保留）
- [x] `tsc --noEmit` 零错误；`vite build` 成功（351KB JS，新增两张 SVG 封面）
- [x] dev server 全部新模块 200，projects.json 正确下发 5 个项目

---

## v6.4 背景风格系统 + 排版优化（2026-08-22）

### 背景风格系统
- **架构**：`src/theme/backgrounds.ts` 风格注册表（每个风格 = 图层开关组合：粒子密度/色相、极光强度、网格增强、鼠标光晕、CSS 星云、扫描线/噪点透明度）→ App 条件渲染图层栈 → localStorage(`ps5-background`) 持久化
- **入口**：ControlBar 设置齿轮（原空壳按钮）→ 新组件 `SettingsPanel`（PS5 控制中心风格毛玻璃下拉，预览色块 + 选中态 + 切换音效），内含「重播开机动画」彩蛋
- **五种风格**：深空星域（默认·全套特效）/ 极光流域（增强极光无粒子）/ 赛博网格（网格扫描线增强+青蓝粒子减半）/ 静谧星云（纯 CSS 无 canvas，低功耗）/ 极简暗夜（全关，阅读模式）
- **图层参数化**：ParticleBackground 接收 density/hue、AuroraBackground 接收 intensity（subtle/normal/enhanced）、GridFloor 接收 enhanced、扫描线/噪点透明度经 CSS 变量 `--scan-opacity`/`--noise-opacity` 注入根节点
- 新组件：SettingsPanel、NebulaBackground（纯 CSS 星云+闪烁亮星）

### 排版优化
- Notes：单列窄栏 → max-w-4xl 双栏 grid + 分类筛选 tabs（带计数、青色高亮）
- About：单栏堆叠 → 桌面端两栏（左：简介+方向标签+联系，右：CV 时间线，紫色轴线+发光节点）
- Footer：删除与 techStack chips 重复的 "Built with..." 行
- ProjectDetail：长文字号 text-lg → text-base leading-7
- 通知铃铛：去掉常亮红点假状态，点击如实显示「暂无新通知」

### ⚠️ 事故记录
- 实现过程中 write 工具路径误填，index.css 被覆盖为 backgrounds.ts 内容（本会话第二次同类失误）。项目无 git；通过当日 dist 构建产物（index-86926c75.css，含全部自定义样式的编译版本）定位自定义段锚点（`*{margin:0` reset）完整提取 10504 字符压缩 CSS，恢复现代伪元素语法后重建，并完成 var() 替换与新样式追加。147 条规则全部校验通过。**教训：批量写文件必须逐字核对 file_path；项目应尽快 git init**

### 验证
- [x] tsc --noEmit 零错误；vite build 成功（CSS 34.46KB / JS 361.91KB）
- [x] dev server 全部新模块 200，HMR 后新样式类生效

### Git 初始化与 GitHub 同步（2026-08-22）
- `git init` + 初始提交（58 文件 / 9086 行），`.gitignore` 排除 node_modules/dist
- 远端：**https://github.com/long1973m/personal-site**（public，main 分支）
- ⚠️ GitHub Push Protection 拦截首次推送：`docs/superpowers/plans/2026-07-04-notion-cms-migration.md` 内含真实 Notion Token（ntn_ 前缀，7月4日旧文档）。已替换为占位符并 amend —— 密钥未进入任何推送历史。远端公开前被完整拦截，无泄露。建议后续轮换该 Notion Integration Token

---

## 备注

- 项目数据在 `src/data/projects.json`，3 个真实项目已填入（Pi Agent / Loop 工程 / 财务健康），封面图仍为占位
- 笔记数据在 `src/data/notes.json`，6 篇精选笔记，支持按分类色条区分
- 头像已压缩为 WebP 格式，保存在 `public/avatar.webp`
- Notion API 已连通（NOTION_API_KEY 已配置），内容可随时从 Notion 读取更新

---

## 今日进度总结（2026-06-21）

### 上午：内容规划
从 Notion 工作区评估了 4 个候选内容，确认 3 个项目 + 笔记专区规划，更新 spec 和进度文档。

### 下午：内容灌入 + 笔记专区（v5.0）

#### 1. 替换 projects.json
从 Notion API 读取 Pi Agent、Loop 工程、财务健康评分 3 个项目的详细内容，提炼亮点填入真实数据：
- 每条包含 `detailDescription`（详情面板展示更丰富的内容）
- 标签、GitHub 链接、封面图种子

#### 2. 新增笔记专区
- 新建 `notes.json` — 从知识库精选 6 篇笔记
- 新建 `NotesCard.tsx` — 左侧分类色条（按类别区分颜色）、hover 效果、箭头指示
- 新建 `Notes.tsx` — stagger 入场，毛玻璃面板展示笔记列表
- 更新 `SidebarNav.tsx` + `MobileTabBar.tsx` — 新增「📝 笔记」Tab（文档图标 SVG）
- 更新 `App.tsx` — 集成 notes 模块

#### 3. 更新 profile.json
- 真实社交链接（GitHub: long1973m, Email: long1973m@gmail.com）
- 更精准的 slogan 和 tags
- 扩充 tools 到 6 个
- 更新 about 段落
- 添加「二度空间」品牌元素

#### 4. TypeScript 修复
- 修复 8 个 TS 编译错误（类型收窄、未使用变量、css 模块声明等）
- 新增 `vite-env.d.ts` 声明文件

### 改动文件

| 文件 | 改动 |
|------|------|
| `src/data/projects.json` | 替换为 3 个真实项目（Pi Agent / Loop 工程 / 财务健康） |
| `src/data/notes.json` | 新建 — 6 篇精选笔记 |
| `src/data/profile.json` | 更新真实信息 |
| `src/components/NotesCard.tsx` | 新建 — 笔记卡片组件 |
| `src/components/Notes.tsx` | 新建 — 笔记专区页 |
| `src/components/SidebarNav.tsx` | 新增 notes TabType + 笔记导航项 |
| `src/components/MobileTabBar.tsx` | 新增笔记 Tab |
| `src/components/ProjectDetail.tsx` | 支持 detailDescription 字段 |
| `src/components/Hero.tsx` | 修复 iconMap 类型 + 无用变量 |
| `src/components/BackgroundBlur.tsx` | 修复 unused import |
| `src/components/CardGrid.tsx` | 修复 unused import + NodeJS 类型 |
| `src/hooks/useSound.ts` | 删除未使用的 SoundType |
| `src/vite-env.d.ts` | 新建 — CSS 模块声明 |
| `src/App.tsx` | 集成 Notes 组件 |

### 待办（下一轮）

- [ ] 替换封面图（picsum 占位 → 真实项目截图/设计图）
- [ ] 部署到 Vercel
- [ ] 笔记区内容逐步扩充

---

## 待办事项（下次继续）

### 第 1 步：替换项目内容
- [ ] 从 Notion 读取 3 个确认项目的详细内容
- [ ] 提炼亮点摘要，组装为 projects.json 的真实数据
- [ ] 找合适的封面图

### 第 2 步：新增笔记专区
- [ ] 新建 `notes.json`
- [ ] 新增 NotesCard 组件
- [ ] 新增「笔记」Tab（SidebarNav + MobileTabBar + App.tsx）

### 第 3 步：Profile 信息更新
- [ ] 更新 profile.json 为真实个人信息

### 第 4 步：构建验证 + 部署
- [ ] 修复 TS 编译报错
- [ ] vite build → 部署 Vercel

---

## 数据流说明

```
App.tsx (selectedIndex + showDetail + activeTab state)
  │
  ├──→ ControlBar (接收 nickname, avatarUrl)
  │
  ├──→ SidebarNav (接收 activeTab, onTabChange)
  │
  ├──→ [activeTab === 'about']  → About
  │
  ├──→ [activeTab === 'projects']
  │      ├──→ Hero (接收 nickname, avatarUrl, slogan, tags, socialLinks)
  │      ├──→ CardGrid (接收 projects, selectedIndex, onSelect, onOpenDetail, disabled, showDetail)
  │      │      └──→ ProjectCard (接收 project, isSelected, isAnySelected, onClick, onOpenDetail, showDetail)
  │      └──→ BackgroundBlur (接收 project 对象)
  │
  ├──→ [activeTab === 'tools']  → Tools
  │
  ├──→ Footer (固定底部，版权 + 技术栈 + 社交链接)
  │
  └──→ ProjectDetail (接收 project, onClose) [条件渲染，共享元素 layoutId]
```

**状态管理**：
- `selectedIndex`：当前选中卡片索引
- `showDetail`：详情面板是否展开（控制卡片图片隐藏 + 共享元素动画）
- `activeTab`：当前 Tab（about/projects/tools）
- SidebarNav 通过回调切换 Tab
- CardGrid 通过回调切换选中项
- ProjectCard 双击/Enter 触发展开详情
- BackgroundBlur 根据当前项目更新背景效果
- ParticleBackground：光标位置追踪（throttle 30ms）
