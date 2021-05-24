<---------------------
  渲染器
  <<----------
  ```javascript
  const { createBundleRenderer } = require('vue-server-renderer')
  const renderer = createBundleRenderer(
    require('./dist/ssr/vue-ssr-server-bundle.json'),
    {
      template: fs.readFileSync('./dist/ssr/index.html', 'utf8'),
      runInNewContext: false,
      clientManifest: require('./dist/ssr/vue-ssr-client-manifest.json')
    }
  )
  function SSRMiddleware (ctx) {
    const context = { // 渲染上下文
      url: ctx.url
    }
    return renderer.renderToString(context).then(html => {
      ctx.type = 'html'
      ctx.body = html
    })
  }
  ```
  <<----------------
  ![webpack](/vue-ssr/vue-ssr.png)
  <<----------------
  渲染上下文和模板
  * 渲染上下文是node环境和app沟通的桥梁
  * 其实就是一个全局共享的对象而已，可以注入任何值
  * 渲染模板就是最终返回的html的模板，支持mustache插值
  * vue-server-render会自动为模板注入 critical CSS，store state，preload, prefetch, script, link等标签
  <<----------------
  <br>
  
  header标签
  ```javascript
  Vue.mixin({
    created () {
      const title = getTitle(this) || 'default title'
      this.$ssrContext.title = title
    }
  })
  ```
  ```html
  <html>
    <head>
      <title>{{ title }}</title>
    </head>
    <body> ... </body>
  </html>
  ```
  <<--------------
  <br>

  如何渲染特定路由？
  
  将用户请求信息通过 context 传递到代码中
  ```javascript
  export default context => {
    const router = createRoute()
    const store = createStore()
    const app = createApp(router, store, App)
    const { url } = context;
    router.push(url.replace(process.env.BASE_URL, ''));
    return new Promise.resolve((resolve) => {
      router.onReady(() => {
        resolve(app)
      })
    })
  }
  ```
