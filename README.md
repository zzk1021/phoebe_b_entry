# 姐姐的视频 · 家长批准视频版

这是一个无需安装依赖的 GitHub Pages 静态网站。只展示家长写入清单的具体视频，保留「历史调研室」（UID 519872016）和「思维实验室」（UID 14583962）。频道 UID 仅用于说明，不请求频道接口、不自动验证视频归属；请家长确认内容及作者后再添加。

## 从旧版迁移（请先完成）

上传新版文件不会自动删除旧文件。在原仓库中删除旧的 scripts/update.py，并删除 .github/workflows/ 下所有旧的「更新视频列表」定时抓取工作流（包含 schedule 或调用 update.py 的文件）。如果暂时不删除，可先到 Actions 打开旧工作流，通过菜单选择 Disable workflow。旧 config.json、videos.json 已不再使用，可删除。

本 ZIP 没有 scripts/update.py，也没有自定义 Actions workflow。不会请求 B站 API、WBI 或 Cookie，不会因列表抓取触发 HTTP 412。实际视频播放仍由 B站外链播放器提供，播放可用性依赖 B站。

## 部署到 GitHub Pages

1. 解压 ZIP，将里面的所有文件上传到仓库根目录，确保根目录直接有 index.html、app.js、style.css、videos.txt（不要再套一层文件夹）。保留 .nojekyll。
2. 仓库 Settings → Pages → Build and deployment，Source 改为 **Deploy from a branch**，Branch 选择 main（或实际使用的分支），文件夹选择 / (root)，保存。不再使用旧版的 GitHub Actions 发布源。
3. 等 GitHub 完成 Pages 发布，打开 Settings → Pages 中显示的网站地址。GitHub 自身的 Pages 构建可能显示在 Actions 中，这是正常的，不会抓 B站。
4. 在 iPad Safari 打开网站 → 分享 → 添加到主屏幕，名称可填「姐姐的视频」。

官方发布源说明：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

## 添加视频：只修改 videos.txt

在 GitHub 仓库打开 videos.txt → 点击铅笔编辑 → 在对应频道下面粘贴一行 → Commit changes 保存。等待 Pages 发布后刷新 iPad 页面即可，不需要修改 HTML，也不需要手动运行更新任务。

格式示例（以下 BV 来自播放器文档，只说明格式，不代表这两个频道的投稿）：

```text
[历史调研室]
BV1B7411m7LV

[思维实验室]
https://www.bilibili.com/video/BV1B7411m7LV/?p=2 | 我给第 2 集起的标题
```

- 每行一条。单写 BV 号、完整 https 视频链接都支持。
- 想显示易读标题，可在后面加「 | 标题」；不写标题就显示 BV 号。网站不自动抓取标题或封面。
- 列表按文件里的顺序显示，最新批准的视频放在频道最上面。
- 删除一行即可撤回；行首加 # 可临时隐藏。空行和 # 注释会被忽略。
- 多集视频用完整链接里的 ?p=2 指定集数，不写则播放第 1 集。每一集都应单独批准。
- 不支持 b23.tv 短链接：先自行打开短链接，复制浏览器地址栏中的完整 bilibili.com/video/BV… 链接。支持 www.bilibili.com、bilibili.com、m.bilibili.com。
- 重复的 BV 号及同一集只显示一次，第一次出现的位置有效。
- 拼错频道名或视频格式时，页面会提示对应行号，其余有效视频仍显示。
- 初始列表为空，示例全部是注释；没有默认批准任何视频。

## 页面与播放

适配 iPad 横竖屏及手机，按钮适合触摸操作。点击批准的视频，在同页内嵌播放；关闭播放会卸载播放器，停止音频。网页没有 B站首页、搜索、热门、推荐及 UP 主主页入口，关闭自动播放和默认弹幕。

播放器使用 sandbox，未授予弹窗或顶层页面跳转权限，以限制打开外部页面。B站播放器是第三方内容，本项目无法修改其内部界面，也无法保证其今后不展示内部推荐或多集切换；分集参数不是严格的内容访问权限。播放、登录、地区、版权、Safari 或 sandbox 兼容性均可能影响可用性。不要把本站当作设备级封锁或绝对的视频白名单；如需严格限制，还需配置 iPad 屏幕使用时间等设备措施。

播放器官方参数：https://player.bilibili.com/

## 排查

- 两个频道显示「家人还在挑选」：请在 videos.txt 里添加真实视频，并去掉那行前面的 #。
- 清单没有更新：检查 Commit 是否保存、Pages 发布是否成功，再刷新 Safari；必要时关闭主屏幕网页后重新打开。
- 清单读取失败：确认 videos.txt 与 index.html 在同一目录；请用网站地址访问，不要双击本地 HTML。
- 视频不能播放：核对 BV 号、该视频是否允许外链播放及 iPad 网络。网站不会自动跳转普通 B站页面。
- 旧 Actions 仍报错：按迁移说明删除或禁用旧工作流，覆盖上传 ZIP 不能代替删除旧文件。

## 文件

index.html 为页面；style.css 为样式；app.js 读取并校验本地清单、创建播放器；videos.txt 为唯一需要日常维护的清单；icon.svg 为网站图标；.nojekyll 禁用 Jekyll；README.md 为本说明。没有后端、密钥、第三方脚本依赖或定时抓取。
