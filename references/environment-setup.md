# 国内旅行接口与环境门禁

本门禁在必填旅行信息齐全后、任何调研前执行。所有探针必须在拥有浏览器会话的宿主环境中运行；沙箱里的 `localhost` 可能错误显示 Browser Bridge 断开。

## OpenCLI、小红书与大众点评

- 安装当前稳定版 OpenCLI，并确认命令在 PATH 中。
- 在 Chrome/Edge 加载 OpenCLI Browser Bridge。
- 使用同一浏览器配置分别登录 `xiaohongshu.com` 和 `dianping.com`。
- Cookie 和密码只留在浏览器配置中，不复制到项目或聊天。

基础探针：

```powershell
opencli --version
opencli doctor
opencli list
opencli xiaohongshu search "<城市> <偏好>" --limit 1 -f json
opencli dianping search "<城市> <偏好>" --city "<城市>" --limit 1 -f json
```

`doctor`、扩展连接和两个真实搜索都成功才算通过。大众点评 `whoami` 可能因页面结构变化失败，不能代替搜索探针。出现 `AUTH_REQUIRED`、验证码、登录墙或空结果时，让用户在同一浏览器配置中完成登录/验证，再重试。不要把未通过登录验证的公开网页结果描述成大众点评或小红书已核验结果。

若 OpenCLI 未安装，先说明将执行的系统级安装并取得所需授权，再按官方仓库安装；不要静默改全局环境。

## 高德开放平台 Key

在高德控制台的同一应用中准备两类 Key：

1. **Web 端（JS API）Key** 与配套 `securityJsCode`，用于网页地图；
2. **Web 服务 API Key**，用于 POI、地理编码、路线和高德 MCP。

建议环境变量名：

```text
AMAP_JS_KEY
AMAP_JS_SECURITY_CODE
AMAP_WEB_SERVICE_KEY
```

- `AMAP_JS_KEY` 会被浏览器加载，可写入生成后的 `index.html`，但必须在控制台限制允许域名。
- `AMAP_JS_SECURITY_CODE` 只能配置在本地/Vercel 服务端环境，通过 `/_AMapService` 代理追加为 `jscode`；不得提交到 Git。
- `AMAP_WEB_SERVICE_KEY` 只用于服务端、MCP 或本地调研；不得进入前端 bundle。
- `.gitignore` 必须覆盖 `.env`、`.env.local`、`.env.*.local` 和任何包含 Key 的临时文件。

检查变量是否存在时只输出“已配置/缺失”，不要回显值。用 Web 服务 Key 对酒店做一次地理编码或 POI 查询，要求响应 `status=1` 且地点属于目标城市。存在变量不等于 Key 可用。

## 高德 MCP 与专属地图

优先使用官方 Streamable HTTP MCP：

```json
{
  "mcpServers": {
    "amap-maps": {
      "url": "https://mcp.amap.com/mcp?key=<AMAP_WEB_SERVICE_KEY>"
    }
  }
}
```

如果客户端只支持本地 I/O，可按高德官方说明运行 `@amap/amap-maps-mcp-server`，并通过环境变量传入 `AMAP_MAPS_API_KEY`。不要把带 Key 的完整 URL 写入仓库。

重新加载 MCP 配置后，列出工具并确认至少有 POI/地理编码能力和 `personal_map` 能力。用酒店名称做一次 POI 或地理编码探针。只有真正调用成功才算通过；仅看到配置文件不算。

## 高德 JS API 安全代理

模板使用：

```js
window._AMapSecurityConfig = {
  serviceHost: `${location.origin}/_AMapService`,
};
```

`assets/site/api/amap-proxy.js` 在服务端把请求转发到高德并追加 `AMAP_JS_SECURITY_CODE`。用 `vercel dev` 预览，确认地图底图、一个标记、缩放/定位控件正常，Network 中的 `/_AMapService` 无 401/403，控制台无 Key、域名或安全密钥错误。禁止在生产 HTML 中使用明文 `securityJsCode`。

## 通过标准

向用户显示一份不含秘密的状态表：OpenCLI、Browser Bridge、小红书搜索、大众点评搜索、Web 服务探针、JS API 页面、AMap MCP、`personal_map`。所有项目均为“已实测通过”后才能进入调研。

任一项未通过时停在本门禁，修复后重测；未经用户明确改变要求，不降级跳过对应数据源。

## 官方依据

- OpenCLI adapters: https://github.com/jackwener/OpenCLI/blob/main/docs/adapters/index.md
- Dianping adapter: https://github.com/jackwener/OpenCLI/blob/main/docs/adapters/browser/dianping.md
- AMap JS API 安全密钥: https://lbs.amap.com/api/javascript-api-v2/guide/abc/jscode
- AMap Web 服务: https://lbs.amap.com/api/webservice/gettingstarted
- AMap MCP 快速接入: https://developer.amap.com/api/mcp-server/gettingstarted
