# Trip Map Builder

面向中国城市旅行的完整技能：先收齐硬信息和实测接口，再调研、确认文字方案、制作手机端高德网页、部署，并生成高德 App 专属旅游地图。

## 强制工作流

1. **必填信息门禁**：旅游城市、酒店名称/地址、抵达时间和枢纽、离开时间和枢纽、景点偏好与美食偏好必须齐全。
2. **接口门禁**：实测 OpenCLI、Browser Bridge、小红书、大众点评、高德 Web 端（JS API）Key、安全密钥、Web 服务 Key 和高德 MCP `personal_map`。
3. **调研与安排**：按区域和真实交通组织景点，结合大众点评与小红书选顺路餐厅。
4. **文字版确认**：先交完整文字行程，用户修改并明确确认后才写网页。
5. **手机网页确认**：只用高德 JS API 2.0 渲染地图和路线，在手机尺寸预览；用户确认后才部署。
6. **GitHub + Vercel**：推送代码、配置服务端安全密钥、部署生产并在手机端复测。
7. **高德专属地图**：调用官方高德 MCP `personal_map`，返回可在高德 App 打开的专属旅行地图链接。

技能不会生成 PDF，也不会用 Leaflet、CARTO、Google Maps、Apple Maps、百度地图或其他地图服务替代高德。

## 规划原则

- 一天一个主区域，抵达日轻量，离开日靠近交通枢纽。
- 行程越顺越好，不把用户清单全部硬塞进去。
- 每天最多一个重预约锚点；天气敏感项目配附近室内备选。
- 餐厅先看当天区域，再用大众点评判断口味、排队、价格和踩雷信号，用小红书补近期体验、氛围和软提醒。
- 文字方案与网页各有一次不可跳过的确认门禁。
- 行程是出发前的参考坐标，旅途中可根据天气、位置、体力和饥饿程度调整。

## 地图与密钥

网页模板位于 [`assets/site/`](assets/site/)，包含：

- `index.html`：高德 JS API 2.0 手机端行程页；
- `api/amap-proxy.js`：Vercel 服务端安全代理；
- `vercel.json`：`/_AMapService` 路由；
- `.gitignore`：排除本地环境和部署状态文件。

需要两类高德 Key：

- Web 端（JS API）Key + `securityJsCode`；
- Web 服务 API Key（POI、地理编码、路线和高德 MCP）。

JS Key 可在页面中加载，但应限制允许域名；`securityJsCode` 与 Web 服务 Key 不能进入前端或 Git。详见 [`references/environment-setup.md`](references/environment-setup.md) 和 [`references/amap-build-deploy.md`](references/amap-build-deploy.md)。

## 安装

```bash
npx skills add hiyeshu/trip-map-builder
```

或把仓库 clone 到支持的 skills 目录。

## 触发示例

- “帮我做北京 4 天游玩计划并生成手机行程地图”
- “查小红书和大众点评，排一个成都美食与景点路线”
- “做个行程网页，最后部署并导入高德专属地图”
- “plan my trip” / “trip map” / “行程规划”

## 目录结构

```text
trip-map-builder/
├── SKILL.md
├── README.md
├── CLAUDE.md
├── assets/
│   └── site/
│       ├── index.html
│       ├── vercel.json
│       ├── .gitignore
│       └── api/amap-proxy.js
└── references/
    ├── trip-planning.md
    ├── environment-setup.md
    ├── dianping-research.md
    ├── xhs-research.md
    ├── amap-build-deploy.md
    └── CLAUDE.md
```

## 许可

MIT
