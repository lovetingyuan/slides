
<--------------------------
  <<---------------
  ### 为何vite无需打包？

  因为目前主流浏览器早已原生支持es模块标准(使用`type="module"`即可)

  浏览器直接根据import去请求vite服务器

  vite收到请求后会把对应的模块交给一系列plugin去处理成标准的es模块返回给浏览器
  <<---------------
  #### 传统的构建工具是怎么做的？

  * 分析整个应用的依赖，递归地构建依赖树
  * 每个模块都要进行转换，排序，合并等等操作
  * 在完成这些之前，服务器是空白的
  * 应用越大，耗时越久
  <<--------------
  ![](https://vitejs.dev/assets/bundler.37740380.png)
  <<--------------
  ![](https://vitejs.dev/assets/esm.3070012d.png)

<------------------
  <<---------------
  vite并不是完全不用打包，它会预先构建第三方依赖

  <!--fragment-->
  * 第三方依赖的模块数量非常多，不打包会导致过多的http请求
  * 第三方依赖很多是commonjs格式，需要转换成esModule
  <<----------------
  ### vite对第三方依赖的构建策略

  * vite默认不会构建任何依赖，直到浏览器访问了它 <!--fragment-->
  * vite只会对依赖构建一次并缓存起来重复使用 <!--fragment-->
  * 每个依赖对应单个bundle，并充分利用协商缓存 <!--fragment-->
  * vite使用**极快**的 [esbuild](https://esbuild.github.io/) 构建依赖 <!--fragment-->

<------------------
  <<--------------
  浏览器虽然原生支持import，但是仍有限制

  <!--fragment-->
  * 引入的路径必须是绝对路径或相对路径或者完整url
  * 引入的资源响应类型必须是JavaScript类型
  <<------------
  路径重写

  ```js
  import { createApp } from 'vue'
  // ==> rewritten to:

  import { createApp } from '/@modules/vue'
  // vite在收到来自/@modules的请求后会返回相应的第三方打包的依赖
  ```

  * import路径重写过程是相当迅速和轻量的（几毫秒），并不会把整个代码转为AST，仅仅只处理`import`语句 <!--fragment-->
  * 在<a href="https://github.com/WICG/import-maps" target="_blank">import-maps</a> 特性的支持下，理论上可以省去import重写的过程 <!--fragment-->
  <<--------------
  模块转换

  vite支持将不是js的资源转换为js模块，但无需任何配置

  例如vite会天然地将html当做entry，css-module也是内置支持，这些都是通过丰富的插件来实现的
  <<-----------
  vite采用基于rollup的插件系统

  vite的插件系统是rollup插件的超集，完全兼容rollup生态 

  ```js
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

  <<--------------
  vite在构建阶段使用rollup来构建

  实际上`rollup`不太适合用来打包业务应用，更适合打包库

  vite通过一系列插件和预配置完善了这些功能，使得构建打包开箱即用
