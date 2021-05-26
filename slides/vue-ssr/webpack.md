
<----------------
  #### Webpack 打包
  <<-----------------
  * 将应用打包为commonjs的格式，将根组件作为默认导出即可
  * 这样nodejs就可以获取到应用的根组件了
  <<-----------
  现在需要增加一份专门为node环境打包的webpack
  ```javascript
    {
      outputDir: 'dist/ssr',
      productionSourceMap: false,
      css: {
        extract: false // 关闭提取css的功能
      },
      configureWebpack: {
        entry: {
          app: [
            './src/server-main.js' // 服务端的入口文件
          ]
        },
        target: 'node', // 目标设置为node环境
        output: {
          libraryTarget: 'commonjs2' // 打包导出的格式为commonjs
        },
        externals: nodeExternals({ // 不打包node_modules中的包
          whitelist: /\.(css|svg)$/
        }),
        optimization: { // 关闭压缩和分包功能
          minimize: false,
          splitChunks: false
        },
        plugins: [
          // require('vue-server-renderer/server-plugin') 引入vue ssr的插件
          new VueSSRServerPlugin(),
          new webpack.DefinePlugin({
            'process.env': {
              VUE_ENV: JSON.stringify(process.env.VUE_ENV)
            }
          }),
        ]
      },
    }
  ```
  <<--------------
  * 上面打包出来只会生成一个名为`vue-ssr-server-bundle.json`的文件
  * 这个文件包含了服务端所有的代码
  <<--------------
  浏览器端打包也需要小小的改动
  ```javascript
  {
    configureWebpack: {
      optimization: {
        runtimeChunk: {
          // 将webpack运行时分包，以便渲染器注入正确的资源标签
          name: 'manifest'
        }
      },
    },
    plugins: [
      // require('vue-server-renderer/client-plugin')，引入客户端的插件
      new VueSSRClientPlugin(),
    ]
  }
  ```
  <<--------------
  * 上面的插件会额外生成`vue-ssr-client-manifest.json`
  * 这个文件包含了所有模块和文件的依赖关系，打包结果等
