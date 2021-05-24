<--------------
  ## [Vite](https://vitejs.dev/)

  <img src="https://vitejs.dev/logo.svg" style="vertical-align:middle" width="100" alt="vite logo"></h3>

  Next Generation Frontend Tooling

  -------
  <!--style=text-align: left-->
  Vite是尤雨溪在去年推出的一款前端开发工具，它提供了与webpack+webpack-dev-server或者parcel相近的功能

  <!--style=text-align: left-->
  包括本地开发服务器，热更新，构建打包等，但无需配置开箱即用。

<-------------------------background-color=var(--theme-color) & style=color: white
  <<-------
  同传统的工具相比，vite显著的快⚡️

  * vite可以在s甚至ms内启动本地开发服务
  * vite的热更新可以在毫秒量级生效
  * vite生产构建时间也要显著小于webpack

  <<----------------
  ### 为什么vite如此快？ <!-- style=color: rgb(249,215,87) -->
  * 无需打包 <!--fragment-->
  * 依赖预构建及硬盘缓存 <!--fragment-->
  * 依赖懒构建 <!--fragment-->
  * 使用esbuild <!--fragment-->
