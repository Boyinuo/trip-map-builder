# 高德手机网页、部署与专属地图

## 项目骨架

把 `assets/site/` 的内容复制到单独的行程项目：

```text
index.html
api/amap-proxy.js
vercel.json
.gitignore
```

将 `index.html` 中的 `__AMAP_JS_KEY__` 替换为 Web 端（JS API）Key，把行程数据填入 `HOTEL` 与 `DAYS`。不要把 `AMAP_JS_SECURITY_CODE` 或 Web 服务 Key 写入 HTML。

所有地点使用高德返回的 GCJ-02 坐标，数据结构统一保留 `lng` 在前、`lat` 在后：

```js
{
  name: "地点名",
  lng: 116.397428,
  lat: 39.90923,
  amapPoiId: "高德 POI ID",
  type: "spot",
  time: "09:30",
  desc: "为什么值得去",
  notice: "预约、闭馆、排队、天气或体力提醒"
}
```

`type` 取 `food | spot | drink | hotel | transport`。每天可提供 `routePath`（Web 服务路线返回的 GCJ-02 折线路径）；没有真实路线时可以画明确标注为“点位顺序示意”的虚线，不得冒充步行/驾车路线。

## 高德独占要求

- 页面渲染：高德 JS API 2.0。
- 点位、坐标、POI ID、路线：高德 Web 服务或高德 MCP。
- 导航：高德 URI API/App 唤端链接，`coordinate=gaode`。
- 不加载 Leaflet、CARTO、Google Maps、Apple Maps、百度地图或其 SDK/瓦片/链接。

## 本地预览与手机 QA

在行程项目中配置本地环境变量后运行 `vercel dev`。不要用 `file://` 或只启动静态服务器，因为安全代理不会工作。

至少检查：

- 360×800、390×844 和一台真实手机；
- 首屏地图高度、刘海/底部安全区、横向 tab、按钮触控区 ≥ 44px；
- 每日切换、标记与卡片对应、路线顺序、总览缩放；
- 高德 App/网页导航链接的地点、经纬度和坐标系；
- 无定位权限时页面仍可用；
- 慢速网络下显示清楚的地图加载/失败状态；
- 控制台无 JS 错误，Network 无高德授权错误；
- 小红书、大众点评和预约链接可打开且不覆盖当前行程状态。

提供可访问预览或手机截图，让用户明确确认。修改后重新做关键 QA，并再次确认。

## GitHub 与 Vercel

部署前检查 `git status` 和 `.gitignore`，再确认 GitHub 仓库公开/私有选择。使用已登录的 GitHub CLI 创建或更新仓库并 push；使用已登录的 Vercel CLI 关联项目。

在 Vercel 项目环境变量中设置 `AMAP_JS_SECURITY_CODE`，覆盖 Preview 和 Production；不要在命令参数或日志中回显值。生产部署后，在正式域名上复测地图和代理，并把域名加入高德 JS Key 的允许域名/Referer 限制。

只有以下条件均满足才算部署完成：GitHub 能看到预期提交、Vercel Production 状态成功、手机端正式 URL 能加载高德地图、控制台无授权错误、导航按钮指向正确 POI。

## 高德 App 专属旅游地图

网页确认并部署后，使用官方高德 MCP 的 `personal_map` 能力创建专属地图。输入最终确认的行程名称、每日说明、按顺序的 POI、注意事项、预约信息和路线提示。优先传 POI ID；名称和坐标用于复核。

检查返回的 `surl.amap.com` 或等价高德唤端链接：

- 能打开高德；
- 行程名称正确；
- 每日分组和点位完整；
- 描述/注意事项没有串点；
- 导航、打车或购票入口（若工具返回）对应正确地点。

最终同时交付 Vercel URL、GitHub URL 和专属地图链接。若 `personal_map` 没有成功返回链接，就明确标记未完成并修复 MCP；不要用普通 URI 多点标注链接冒充专属地图。

## 官方依据

- AMap JS API 2.0: https://lbs.amap.com/api/javascript-api-v2/getting-started
- AMap URI API: https://lbs.amap.com/api/uri-api/gettingstarted
- AMap personal map: https://developer.amap.com/api/mcp-server/application-case/travel-planning-case
