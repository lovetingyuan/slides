<title>Vue2 SSR</title>
<meta name="theme" content="beige">
<meta name="code-theme" content="tomorrow">

<----------------
  ### VUE SSR
  <<-------------
  * 概念
  * 流程
  * 实现
  * 问题
  * 部署
<---------------
  <<-------------
  ### 什么是服务端渲染
  在服务端渲染vue组件，将生成的html返回

  ```javascript
      const App = require('App.vue') // root component
      const app = new Vue({
        render(h) { return h(App) }
      })
      server.get('/', (req, res) => {
        res.type = 'html'
        res.body = renderToHtml(app)
      })
  ```
  <<-------------
  和prerender有何不同？
  * prerender是将应用跑在浏览器环境得到的html
  * SSR是将单个组件通过框架运行时得出渲染后的html

<------------
  ### Vue SSR的流程
  ![Vue SSR的流程图](/slides/vue-ssr/ssr.png)


<include src="./webpack.md">
<include src="./renderer.md">

<include src="./issue.md">
<include src="./async.md">
<include src="./cache.md">

<------------
部署
  <<---------
  * 项目部署配置修改
  * 使用 forever, pm2 等工具
  * nginx 配置修改

<-----------------
  Vue2 SSR 官方指南

  [https://ssr.vuejs.org/](href="https://ssr.vuejs.org/")

----------
  Thanks, Q&A
