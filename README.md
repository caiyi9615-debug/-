# 米米大王运筹学复习网站 - Render Web Service 版

这个包是把“复习网站”改成和你后面那个正常网站一样的 Render Web Service 项目结构。

## 文件结构

上传到 GitHub 后，仓库根目录应该是：

```text
server.js
package.json
Dockerfile
public/
  index.html
README.md
```

## Render 部署方式

1. 打开 Render
2. 点击 New
3. 选择 Web Service
4. 连接 GitHub 仓库
5. Environment / Runtime 选择 Docker
6. Branch 选择 main
7. Root Directory 留空
8. 点击 Create Web Service

## 注意

这个复习网站是前端打卡网页，打卡和备注保存在当前浏览器本地。
如果换手机，浏览器本地数据不会自动同步。
