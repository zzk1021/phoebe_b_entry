# 姐姐的视频

一个给 iPad 使用的简化 B站入口。目前白名单只有：
- 历史调研室（UID 519872016）
- 思维实验室（UID 14583962）

页面只显示白名单 UP 主的视频，并使用 B站嵌入播放器播放，不提供 B站首页、搜索、热门和推荐入口。

## 部署到 GitHub Pages
1. 在 GitHub 新建一个公开仓库，例如 `jiejie-video`，默认分支使用 `main`。
2. 把本项目全部文件上传到仓库根目录（包括 `.github`）。
3. 打开仓库 **Settings → Pages**，在 **Build and deployment → Source** 选择 **GitHub Actions**。
4. 打开 **Actions → 更新视频列表 → Run workflow**，先手动运行一次。成功后会生成 `data/videos.json` 并自动提交。
5. `部署 Pages` workflow 会随后运行。完成后，在 Settings → Pages 可以看到网页地址。
6. 用姐姐的 iPad Safari 打开网页 → 分享 → **添加到主屏幕**。

## 自动更新
`更新视频列表` 每天自动运行一次（cron 使用 UTC）。每个频道默认保留最新 30 个视频。

## 添加新的白名单 UP 主
编辑 `config.json`，增加：
```json
{"name":"UP主名字","mid":"B站UID","icon":"📚"}
```
然后手动运行一次“更新视频列表”，或者等下一次定时任务。

## 家长控制建议
这个项目的设计目的是减少算法信息流，而不是构成无法绕过的设备级访问控制。若 Safari 仍允许自由访问 bilibili.com，孩子仍可能手动进入普通 B站网页。建议同时删除/限制 B站 App，并使用 iPad 屏幕使用时间管理 Safari 与 App 安装权限。

## 故障排查
B站并未把这些 Web API 作为稳定的第三方公共 API 保证长期兼容。如果“更新视频列表”失败，通常是接口签名或风控发生变化；网页中已经生成的视频列表不会因此消失。
