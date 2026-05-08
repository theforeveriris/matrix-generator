# n×n 色彩矩阵生成器 - SPEC.md

## 1. Concept & Vision

一个生成艺术风格的色彩矩阵工具，灵感来自极简主义数字艺术与参数化设计。界面如同一个专业创意工具——深邃的暗色调背景衬托出绚丽的色彩矩阵，让用户感受到"创造视觉艺术"的乐趣而非简单的"填充颜色"。

## 2. Design Language

### Aesthetic Direction
深空极简主义 + 赛博朋克微光：深色背景搭配霓虹色彩点缀，网格如同发光的像素点在空间中漂浮。

### Color Palette
- **Background**: `#0a0a0f` (深空黑)
- **Surface**: `#12121a` (面板背景)
- **Border**: `#2a2a3a` (边框)
- **Text Primary**: `#f0f0f5` (主文字)
- **Text Secondary**: `#888899` (次要文字)
- **Accent Cyan**: `#00d4ff` (霓虹青)
- **Accent Magenta**: `#ff00aa` (霓虹粉)

### Typography
- **Display**: "Space Grotesk" - 科技感标题
- **Body**: "JetBrains Mono" - 数值显示与代码感

### Motion Philosophy
- 网格生成时有轻微的"涌现"动画，从中心向外扩散
- 颜色切换采用平滑过渡
- 控件交互有微妙的发光反馈

## 3. Layout & Structure

```
┌─────────────────────────────────────────────────────────┐
│  ◆ MATRIX GENERATOR                          [生成] 按钮 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │                                                   │   │
│  │                                                   │   │
│  │                   [n×n 色彩矩阵]                  │   │
│  │                                                   │   │
│  │                                                   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  CONTROLS                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐ │
│  │ Grid Size n  │ │ Chaos Level │ │ Algorithm Mode   │ │
│  │ [3] ──○── [32]│ │ [1] ──○── [10]│ │ [Random/Pattern] │ │
│  └──────────────┘ └──────────────┘ └──────────────────┘ │
│                                                         │
│  Color Palette                                          │
│  ┌────────────────────────────────────────────────────┐│
│  │ [Preset 1] [Preset 2] [Preset 3] [Preset 4] [Custom]││
│  │ +──+──+──+──+──+──+──+──+──+──+──+──+──+──+──+──+──+││
│  │ Custom: [color input slots]                        ││
│  └────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

## 4. Features & Interactions

### Core Features

**1. 网格生成**
- 默认 8×8，可调范围 3-32
- 点击"生成"或拖动滑块实时预览
- 每次生成有轻微的动画效果

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
- 点击颜色槽位添加颜色
- 支持 HEX 输入或颜色选择器
- 右键/长按删除颜色

## 5. Component Inventory

### Grid Cell
- 默认: 带微弱边框，圆角 2px
- Hover: 轻微放大 (1.05)，边框高亮
- Transition: 0.3s ease-out

### Slider Control
- Track: 细线条 + 渐变填充
- Thumb: 圆形发光点
- Value Display: 滑块上方实时数值

### Palette Selector Button
- 未选中: 灰色边框，白色图标
- 选中: 主题色边框 + 底部高亮条 + 微微发光
- Hover: 背景微亮

### Custom Color Slot
- 空槽: 虚线边框 + "+" 图标
- 有色槽: 显示颜色 + 点击可改 + 右上角删除按钮
- 添加动画: scale 0→1 弹出

### Generate Button
- 默认: 渐变背景 (accent cyan → accent magenta)
- Hover: 背景加亮 + 轻微上浮阴影
- Active: 缩小反馈
- Loading: 脉冲动画

## 6. Technical Approach

### Architecture
纯原生 JavaScript，采用 ES6 模块化架构，文件分离如下：

```
/workspace
├── index.html           # 主 HTML 结构
├── css/
│   └── styles.css       # 所有样式
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
- CSS Grid 实现矩阵布局
- CSS Custom Properties 管理主题
- ES6 Modules (import/export)
- 无外部框架依赖
