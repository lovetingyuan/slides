
<----------------------------
  ### 热更新支持

  * 内置对主流框架的热更新支持而无需额外配置
  * 支持自定义热更新插件（HMR Api）

  <!--fragment-->
  ```javascript
  export const count = 1

  if (import.meta.hot) {
    import.meta.hot.accept((newModule) => {
      console.log('updated: count is now ', newModule.count)
    })
  }
  ```

<------------------------
  #### 其他特性概览

  <<------------
<!-- style=margin-top: 50px -->
  * 内置支持多种文件格式，html,vue,jsx,ts,tsx,json,postcss,css-module,scss,less,images,web-assembly,web-workers... 
  * 支持glob import

    ```js
    const modules = import.meta.glob('./dir/*.js')
    // code produced by vite
    const modules = {
      './dir/foo.js': () => import('./dir/foo.js'),
      './dir/bar.js': () => import('./dir/bar.js')
    }
    ```
  
  <<-----------
  * css自动分包，压缩，url重写，内联data协议
  * 公用模块提取
  * 模块import alias支持
  * 更贴近语言标准的环境变量注入和替换，如 <code>import.meta.env.NODE_ENV</code>
  * SSR全流程支持（experimental）
  * 开箱即用的本地代理
  * 支持multi-page模式和library模式构建
  <<--------
  * 同时支持modern模式和legacy模式构建以及pre-标签注入
  * vite dev server可以独立作为middleware使用
  * 支持构建阶段生成reporter和manifest
  * 丰富的项目模板，vue,react,svelte,preact,lit-element
  * 完整的TypeScript支持
  * 配置文件更改即时生效
  * ......
