# 米米大王运筹学复习网站 - 换手机云同步版

## 文件结构

```text
server.js
package.json
Dockerfile
supabase.sql
README.md
public/
  index.html
```

## 一、Supabase 建表

1. 打开 Supabase
2. 新建项目
3. 进入 SQL Editor
4. 复制 `supabase.sql` 里的内容并运行

## 二、Render 环境变量

在 Render 的 Web Service 设置里添加：

```text
SUPABASE_URL=你的 Supabase Project URL
SUPABASE_SERVICE_ROLE_KEY=你的 Supabase service_role key
```

注意：service_role key 只能放 Render 后端环境变量里，不要写到前端页面。

## 三、Render 部署

1. 上传本包到 GitHub
2. Render → New → Web Service
3. 选择 Docker
4. Root Directory 留空
5. 部署

## 四、换手机使用方法

旧手机：
1. 打开网站
2. 输入同步码，例如 `mimi520`
3. 点击“上传当前数据”

新手机：
1. 打开同一个网站
2. 输入同一个同步码
3. 点击“从云端恢复”

之后打卡和备注会自动上传云端。
