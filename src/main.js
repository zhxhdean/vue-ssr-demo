// The Vue build version to load with the `import` command (runtime-only or
// standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import { createRouter } from './router'
Vue.config.productionTip = false

// 导出一个工厂函数，用于创建新的应用程序/router/store实例
export function createApp () {
  const router = createRouter()
  const app = new Vue({
    router,
    // 根实例简单的渲染应用程序组件
    render: h => h(App)
  })
  return {app, router}
}
