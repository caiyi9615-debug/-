# 米米大王运筹学复习网站 - Render Web Service 版

这个版本适合你在 Render 里选择 Web Service / Docker 部署。

## 仓库结构

上传到 GitHub 后，仓库里应该是：

```text
index.html
Dockerfile
README.md
```

## Render 设置

1. Render 点击 New
2. 选择 Web Service
3. 连接 GitHub 仓库
4. Environment / Runtime 选择 Docker
5. Branch 选择 main
6. Root Directory 留空
7. 点击 Create Web Service

Render 会自动读取 Dockerfile，然后用 Nginx 启动这个网页。

## 注意

这个网站是纯前端网页，打卡和备注会保存在当前浏览器本地。
换手机会没有原来的本地数据，除非之后再接 Supabase 云同步。
