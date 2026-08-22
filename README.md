# PS5 风格个人主页

一个模仿 PS5 主菜单风格的个人主页，展示你的工作研究项目。

## 功能特性

- 🎨 深色背景 + 紫蓝渐变粒子动画
- 🃏 横向滚动的项目卡片网格（桌面端）
- ✨ 玻璃态（glassmorphism）材质效果
- 🌟 选中卡片放大发光 + 霓虹边框
- 🎭 背景模糊随选中项目变化
- 📱 响应式设计（桌面横排，手机竖排）
- ⌨️ 支持鼠标滚轮和方向键导航

## 快速开始

### 1. 安装依赖

```bash
cd ps5-homepage
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 打开浏览器

访问 http://localhost:5173

## 技术栈

- React 18 + TypeScript
- Tailwind CSS
- Framer Motion（动画）
- Canvas API（粒子效果）
- Vite（构建工具）

## 项目结构

```
ps5-homepage/
├── public/
│   ├── avatar.webp          # 头像（已压缩为 WebP）
│   └── vite.svg             # 网站图标
├── src/
│   ├── components/
│   │   ├── ParticleBackground.tsx   # 粒子背景
│   │   ├── CardGrid.tsx             # 卡片网格
│   │   ├── ProjectCard.tsx          # 项目卡片
│   │   ├── UserProfile.tsx          # 用户信息卡片
│   │   └── BackgroundBlur.tsx       # 背景模糊效果
│   ├── data/
│   │   └── projects.json            # 项目数据
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 自定义

### 修改个人信息

编辑 `src/App.tsx` 中的 `nickname` 和 `avatarUrl`。

### 修改项目数据

编辑 `src/data/projects.json` 文件。

### 修改颜色主题

编辑 `tailwind.config.js` 中的 `colors` 部署。

## 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 Vercel 导入项目
3. 自动部署完成

## 后续扩展

- [ ] 对接 Notion API 获取项目数据
- [ ] 添加点击卡片跳转详情页
- [ ] 增加更多动画效果
- [ ] 优化移动端触摸滑动体验
