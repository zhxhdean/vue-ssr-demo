// 客户端entry只需要创建应用程序，并且将其挂载到DOM中
import { createApp } from './main'
// 客户端特定引导逻辑
const { app } = createApp()
app.$mount('#app')
