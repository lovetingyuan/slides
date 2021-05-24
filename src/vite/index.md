<------------------------
  ### Vite

  <img src="https://vitejs.dev/logo.svg" style="vertical-align:middle" width="100" alt="vite logo"></h3>

  Next Generation Frontend Tooling

  Vite是尤雨溪在去年推出的一款前端开发工具，它提供了与webpack+webpack-dev-server或者parcel相近的功能，包括本地开发服务器，热更新，构建打包等，但大部分的功能均开箱即用。
---------->

<-------------------------background-color=#747bff
  <div style="color: white">
  同传统的工具相比，vite显著的快⚡️

  * vite可以在s甚至ms内启动本地开发服务
  * vite的热更新可以在毫秒量级生效
  * vite生产构建时间也要显著小于webpack
  </div>
--------->

<------------
  ### 为什么vite如此快？

  * [无需打包]
  * [依赖预构建及硬盘缓存]
  * [依赖懒构建]
  * [使用esbuild]
---------->

<--------------------------
  ### 为何vite无需打包？

  因为目前主流浏览器早已原生支持es模块标准(使用type="module"即可)

  浏览器直接根据import去请求vite服务器

  vite收到请求后会把对应的模块交给一系列plugin去处理成标准的es模块返回给浏览器
------------>

<---------------
  <---------------
  #### 传统的构建工具是怎么做的？

  * 分析整个应用的依赖，递归地构建依赖树
  * 每个模块都要进行转换，排序，合并等等操作
  * 在完成这些之前，服务器是空白的
  * 应用越大，耗时越久
  -------------->
  <--------------
  ![](/src/vite/dev-server.jpg)
  -------------->
  <--------------
  ![](/src/vite/es-server.jpg)
  -------------->
----------->

<------------------
  <---------------
  vite并不是完全不用打包，它仍然会预先构建第三方依赖
  * 第三方依赖的模块数量非常多，不打包会导致过多的http请求
  * 第三方依赖很多是commonjs格式，需要转换成esModule
  --------------->
  <----------------
  vite对第三方依赖的构建策略

  * [vite默认不会构建任何依赖，直到浏览器访问了它]
  * [vite只会对依赖构建一次并缓存起来重复使用]
  * [每个依赖对应单个bundle，并充分利用协商缓存]
  * [vite使用**极快**的<a href="https://esbuild.github.io/">esbuild</a>构建依赖]
  ----------->
---------->

<------------------
  <--------------
  浏览器虽然原生支持import，但是仍有限制
  [-----
  * 引入的路径必须是绝对路径或相对路径或者完整url
  * 引入的资源响应类型必须是JavaScript类型
  -----]
  ------------>
  <------------
  路径重写

```javascript
import { createApp } from 'vue'
// ==> rewritten to:

import { createApp } from '/@modules/vue'
// vite在收到来自/@modules的请求后会返回相应的第三方打包的依赖
```
  * [import路径重写过程是相当迅速和轻量的（几毫秒），并不会把整个代码转为ast，仅仅只处理import语句]
  * [在<a href="https://github.com/WICG/import-maps" target="_blank">import-maps</a> 特性的支持下，理论上可以省去import重写的过程]
  ---------------->
  <--------------
  模块转换

  vite支持将不是js的资源转换为js模块，但无需任何配置

  例如vite会天然地将html当做entry，css-module也是内置支持，这些都是通过丰富的插件来实现的
  ---------->
  <-----------
  vite采用基于rollup的插件系统

  vite的插件系统是rollup插件的超集，完全兼容rollup生态 

```javascript
{
  name: 'md-loader',
  load(id) {
    if (id.endsWith('.md')) {
      const source = fs.readFileSync(id, 'utf8')
      return `export default ${JSON.stringify(marked(source))}`
    }
  }
}
```

  ------------->
  <--------------
  vite在构建阶段使用rollup来构建

  实际rollup不太适合用来打包业务应用，更适合打包库

  vite通过一系列插件完善了这些功能
  -------------->
-------------->

<----------------------------
  热更新支持

  * 内置对主流框架的热更新支持而无需额外配置
  * 支持自定义热更新插件
  [------
```javascript
export const count = 1

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    console.log('updated: count is now ', newModule.count)
  })
}
```
  -----]
-------------->

<------------------------
  <ul style="zoom: .5">
    <li>内置支持多种文件格式，html,vue,jsx,ts,tsx,json,postcss,css-module,scss,less,images,web-assembly,web-workers...</li>
    <li>
      支持glob import

```javascript
const modules = import.meta.glob('./dir/*.js')
// code produced by vite
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
  './dir/bar.js': () => import('./dir/bar.js')
}
```

  </li>
  <li>css自动分包，压缩，url重写，内联data协议</li>
  <li>公用模块提取</li>
  <li>模块import alias支持</li>
  <li>更贴近语言标准的环境变量注入和替换，如 <code>import.meta.env.BASE_URL</code></li>
  <li>SSR全流程支持（experimental）</li>
  <li>支持multi-page模式和library模式构建</li>
  <li>同时支持modern模式和legacy模式构建以及pre-标签注入</li>
  <li>vite server可以独立作为middleware使用</li>
  <li>开箱即用的本地代理</li>
  <li>支持构建阶段生成reporter和manifest</li>
  <li>丰富的项目模板，vue,react,svelte,preact,lit-element</li>
  <li>完整的TypeScript支持</li>
  <li>......</li>
  </ul>
-------------->

<-----------------------------
和vite相似的工具

* <a href="https://www.snowpack.dev/">snowpack</a>
* <a href="https://github.com/preactjs/wmr">wmr</a>
* <a href="https://modern-web.dev/docs/dev-server/overview/">@web/dev-server</a>
-------------->

<-------------------
<a href="https://vitejs.dev/">vitejs</a>

<a href="https://docs.google.com/presentation/d/1X1hrFw18v67bEniTPpaI_DBulLdkKNFEc_3nVEm95mM">Vite & VitePress @ Vue Toronto 2020</a>

<a href="https://antfu.me/posts/vue-beijing-2021">Develop with Vite - at Vue Beijing</a>

Q&A
-------------->
