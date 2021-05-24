<----------
数据预取
  <<---------
  * 为什么数据需要预取？
  * 在哪里预取数据？
  * 取得的数据放在哪里？
  <<---------
  为什么数据需要预取？
  * 因为本质上SSR是个同步过程，仅执行组件初始化渲染
  * 所以SSR在渲染组件之前必须获取到组件需要的数据
  <<---------
  在哪里预取数据？
  * Vue并不知道组件会在何处何时发出请求
  * 所以我们可以在组件上约定一个获取数据的方法，返回一个promise
  <<---------
  取得的数据放在哪里？
  * 取得的数据无法放在组件内
  * 所以需要放在Vuex的store中
  <<---------
  组件定义
  ```javascript
  export default {
    // SSR会调用这个钩子预取数据，必须返回promise
    serverPrefetch () {
      return this.fetchItem()
    },
    methods: {
      fetchItem () {
        return this.$store.dispatch('fetchItem', this.$route.params.id)
      }
    },
  }
  ```
  <<---------
  根组件解析完毕后，将预取数据填充到context中
  ```javascript
  export default context => {
    return new Promise((resolve, reject) => {
      const { app, router, store } = createApp()
      router.push(context.url)
      router.onReady(() => {
        const matchedComponents = router.getMatchedComponents()
        if (!matchedComponents.length) {
          return reject({ code: 404 })
        }
        context.rendered = () => {
          // 渲染器会将state序列化为window.__INITIAL_STATE__并填充到模板中
          context.state = store.state
        }
        resolve(app)
      }, reject)
      router.onError(reject)
    })
  }
  ```
  <<---------------
  浏览器端将预取的数据存放到vuex store中
  ```javascript
  if (window.__INITIAL_STATE__) {
    store.replaceState(window.__INITIAL_STATE__)
  }
  ```
  <<---------------
  浏览器端数据预取需要注意二次获取的问题
  ```javascript
  {
    mounted () {
      if (!this.$store.item) {
        this.fetchItem() // 避免重复获取数据
      }
    },
    methods: {
      fetchItem () {
        return this.$store.dispatch('fetchItem', this.$route.params.id)
      }
    }
  }
  ```
