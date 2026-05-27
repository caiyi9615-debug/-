# 米米大王运筹学复习网站 - 云同步修复版

## 修复内容

上一版使用 `@supabase/supabase-js`，Render Node 20 可能报 WebSocket 错误。
本版改为后端直接调用 Supabase REST API，不再需要 WebSocket，也不再依赖 Supabase SDK。

## Render 环境变量

仍然需要：

```text
SUPABASE_URL=https://你的项目.supabase.co
SUPABASE_SERVICE_ROLE_KEY=你的 sb_secret_...
```

## GitHub 根目录结构

```text
server.js
package.json
Dockerfile
supabase.sql
README.md
public/
  index.html
```

## Render 部署

1. 上传全部文件到 GitHub 根目录
2. Render → Manual Deploy → Deploy latest commit
3. 日志看到 `mimi study cloud sync REST site running on 3000` 就成功

## Supabase

如果还没建表，运行 `supabase.sql`。
