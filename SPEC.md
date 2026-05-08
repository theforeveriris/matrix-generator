# n×n 色彩矩阵生成器 - SPEC.md

## 1. Concept & Vision

一个生成艺术风格的色彩矩阵工具，融合日式极简美学与 70-80 年代杂志设计感。温暖的米色纸张质感背景搭配低饱和度色彩，营造出如同翻阅精致设计杂志般的体验——干净、留白充足、却又不失趣味。

## 2. Design Language

### Aesthetic Direction
日式极简 × 70-80年代杂志美学：大量留白、讲究的字体排版、微妙的手工质感。

### Color Palette
- **Background**: `#f5f2ed` (米色纸张)
- **Background Dark**: `#ebe7e0` (深米色)
- **Surface**: `#faf8f5` (浅米白)
- **Border**: `#d4cfc6` (暖灰边框)
- **Border Dark**: `#c4beb3` (深边框)
- **Text Primary**: `#2c2c2c` (近黑)
- **Text Secondary**: `#6b6560` (暖灰文字)
- **Text Muted**: `#9a948c` (浅灰文字)
- **Accent Sage**: `#8b9a7d` (鼠尾草绿)
- **Accent Terracotta**: `#c4917a` (赤陶色)
- **Accent Dusty Blue**: `#7d8fa3` (灰蓝)
- **Accent Warm**: `#d4a574` (暖棕)

### Typography
- **Display**: "Cormorant Garamond" - 优雅的衬线字体
- **Mono**: "Space Mono" - 等宽字体用于数据/标签

### Motion Philosophy
- 网格生成时有优雅的淡入缩放动画
- 悬停时格子轻微放大，柔和过渡
- 整体动画克制而精致

## 3. Layout & Structure

```
┌─────────────────────────────────────────────────────┐
│  ■■■■ MATRIX GENERATOR                      [Generate] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ ┌                                         ┐ │   │
│  │                                             │   │
│  │                                             │   │
│  │              [n×n 色彩矩阵]                 │   │
│  │                                             │   │
│  │                                             │ │   │
│  │ └                                         ┘ │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌────────────┐ ┌────────────┐ ┌────────────────┐  │
│  │Parameters  │ │Algorithm   │ │Palette         │  │
│  │            │ │            │ │                │  │
│  │Grid Size   │ │[5 buttons] │ │[4 presets]     │  │
│  │[slider]    │ │            │ │Custom [slots]  │  │
│  │            │ │            │ │                │  │
│  │Chaos Level │ │            │ │                │  │
│  │[slider]    │ │            │ │                │  │
│  ├────────────┤ │            │ │                │  │
│  │Info        │ │            │ │                │  │
│  │Grid 8×8    │ │            │ │                │  │
│  │Colors 6    │ │            │ │                │  │
│  └────────────┘ └────────────┘ └────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## 4. Features & Interactions

### Core Features

**1. 网格生成**
- 默认 8×8，可调范围 3-32
- 点击"Generate"或拖动滑块实时预览
- 优雅的淡入动画

**2. 混乱程度控制 (Chaos Level)**
- Level 1-10
- Level 1: 高度有序，遵循算法模式
- Level 5: 半随机半模式
- Level 10: 完全混乱随机

**3. 算法模式**
- **Random**: 纯随机选择颜色
- **Gradient**: 对角线渐变过渡
- **Wave**: 波浪状分布
- **Block**: 分块聚集
- **Diamond**: 菱形从中心扩散

**4. 预设色谱**
- **Neon**: 深色背景专用鲜艳霓虹色 [#ff0080, #00ffff, #ffff00, #ff00ff, #00ff80, #8000ff]
- **Sunset**: 橙红到紫的暖色调 [#ff4500, #ff6b35, #f7931e, #ffcc00, #ff8c42, #e85d04]
- **Ocean**: 深海到浅海的蓝绿系 [#001219, #005f73, #0a9396, #94d2bd, #e9d8a6, #ee9b00]
- **Forest**: 自然绿色系 [#2d6a4f, #40916c, #52b788, #74c69d, #95d5b2, #b7e4c7]

**5. 自定义色谱**
- 最多 8 个颜色
- 点击圆形槽位添加颜色
- 支持颜色选择器
- 悬停显示删除按钮

## 5. Component Inventory

### Grid Cell
- 默认: 无间距，紧凑排列
- Hover: 放大 1.15 倍
- Transition: 0.4s ease

### Slider Control
- Track: 2px 细线条
- Thumb: 12px 圆形
- Value Display: 鼠尾草绿色

### Algorithm Button
- 未选中: 透明背景 + 边框
- 选中: 黑底白字
- Hover: 边框变深

### Palette Selector
- 未选中: 灰边框
- 选中: 2px 鼠尾草绿边框
- 颜色点为圆形

### Custom Color Slot
- 空槽: 圆形虚线边框
- 有色槽: 实线圆形 + 悬停显示删除按钮

### Generate Button
- 默认: 透明背景 + 黑边框
- Hover: 黑底白字
- 箭头图标装饰

## 6. Technical Approach

### Architecture
纯原生 JavaScript，采用 ES6 模块化架构，文件分离如下：

```
/workspace
├── index.html           # 主 HTML 结构
├── css/
│   └── styles.css       # 复古极简风格样式
└── js/
    ├── constants.js     # 常量配置（色谱、算法、默认值）
    ├── state.js         # 状态管理（响应式状态）
    ├── generator.js     # 矩阵生成算法
    ├── sliders.js       # 滑块控件
    ├── palette.js       # 色谱管理
    ├── ui.js            # UI 交互
    └── main.js          # 主入口
```

### Tech Stack
- CSS Grid 实现矩阵和布局
- CSS Custom Properties 管理主题
- SVG 噪点纹理叠加
- ES6 Modules (import/export)
- 无外部框架依赖
