# 内容修改指南

这个网站目前是 React + Vite 静态作品集，内容可以直接改项目文件后重新预览。

## 常改内容

- 网站标题、首页大标题、个人介绍、邮箱、微信：改 `src/portfolioData.js` 里的 `siteInfo`
- 精选案例：改 `src/portfolioData.js` 里的 `caseStudies`
- 作品墙图片和标题：改 `src/portfolioData.js` 里的 `galleryItems`
- 服务方向标签：改 `src/portfolioData.js` 里的 `services`
- 图片素材：放在 `public/assets/portfolio/`

## 替换图片

把新图片放进 `public/assets/portfolio/`，然后在 `src/portfolioData.js` 里把对应的图片名改成新文件名。

例如：

```js
image: asset('new-project-cover.jpg')
```

## 目前还不是后台

现在不能像公众号后台那样在浏览器里点文字直接编辑。如果需要，可以继续加一个本地编辑面板，用表单修改作品、联系方式和图片。

## 预览方式

如果 `http://127.0.0.1:5173/` 打不开，通常是本地预览服务已经停止。当前已生成一个可直接打开的静态版本：

`outputs/portfolio-site/index.html`
