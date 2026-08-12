---
AIGC:
    Label: "1"
    ContentProducer: 001191440300708461136T1XGW3
    ProduceID: ce9ca49c444846fed448aa9728a43a8e_6858d53e95e911f181ac525400f8a581
    ReservedCode1: FjPY4EqulCoIrhuEeSnJ/jpJhc84wiLypU3ZYxgdZuoxDzrL96vzgxLw7NaX9ibXmc4t5ntAiww9kvMrsZ5Ulyl8JCuIeyBDAKuGsQNtdvzZCLe1qmTqxbSZOkKQsU7Ip822bhDQ1KyCNkwTgwLrEfyf86P/eqWKoJRm4hrmSv9M8WtVFmec+/aFAC0=
    ContentPropagator: 001191440300708461136T1XGW3
    PropagateID: ce9ca49c444846fed448aa9728a43a8e_6858d53e95e911f181ac525400f8a581
    ReservedCode2: FjPY4EqulCoIrhuEeSnJ/jpJhc84wiLypU3ZYxgdZuoxDzrL96vzgxLw7NaX9ibXmc4t5ntAiww9kvMrsZ5Ulyl8JCuIeyBDAKuGsQNtdvzZCLe1qmTqxbSZOkKQsU7Ip822bhDQ1KyCNkwTgwLrEfyf86P/eqWKoJRm4hrmSv9M8WtVFmec+/aFAC0=
---

# AI 工具导航站

一个收录了 **32 个 AI 工具**的导航网站，按 **7 个分类**整理，方便快速浏览和找到需要的 AI 工具。

---

## 功能特性

- **搜索过滤**：在工具库页面可按工具名或分类实时搜索，自动隐藏不匹配的内容
- **收藏工具**：每张工具卡右上角有 ★ 按钮，点击收藏/取消收藏；收藏状态通过 localStorage 持久化，刷新页面或关闭浏览器后仍然保留
- **三页结构**：
  - 首页：站名 + 搜索框 + 分类入口 + 本周推荐
  - 工具库：按分类展示全部 32 个工具，支持搜索过滤
  - 关于我：项目介绍和联系方式
- **导航高亮**：当前所在页面的导航链接自动高亮

## 技术栈

纯静态网页，零框架、零依赖：

- **HTML**：页面结构与内容
- **CSS**：样式与布局（浅色多彩风，白底 + 分类彩色卡片）
- **JavaScript**：交互逻辑（搜索过滤、收藏管理、导航高亮）

## 项目结构

```
AI 工具导航站/
├── index.html      # 首页
├── tools.html      # 工具库（32 个工具，7 个分类）
├── about.html      # 关于我
├── style.css       # 共用样式
├── script.js       # 交互脚本（搜索、收藏、导航）
├── img/            # 工具图标图片
└── README.md       # 项目说明（本文件）
```

## 本地启动

### 方式一：直接双击打开

用浏览器直接打开 `index.html` 即可，无需安装任何东西。

### 方式二：本地 HTTP 服务器（推荐）

收藏功能依赖 `localStorage`，直接双击打开已可正常使用。若需要通过本地服务器运行（避免某些浏览器对 `file://` 协议的限制），在项目根目录执行：

```bash
python -m http.server 8001
```

然后浏览器访问 http://localhost:8001

---

## 七大类目

| 分类 | 工具数 | 示例 |
|------|--------|------|
| AI 对话 | 6 | ChatGPT、Claude、Kimi |
| AI 写作 | 4 | 笔灵AI、秘塔写作猫 |
| AI 画图 | 5 | Midjourney、DALL-E、即梦 |
| AI 编程 | 5 | GitHub Copilot、Cursor |
| AI 办公/PPT | 4 | Gamma、讯飞智文 |
| AI 视频 | 4 | Runway、剪映、Sora |
| AI 音频/音乐 | 4 | Suno、ElevenLabs |

---

猪猪的 AI 工具导航 · 用爱发电
*（内容由AI生成，仅供参考）*
