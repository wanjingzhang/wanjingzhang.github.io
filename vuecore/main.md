### 框架解读

###### 1. 初始化vue应用

```
createApp()（runtime-dom/index.ts）

if (process.env.NODE_ENV === 'production') { // production 生产环境
  module.exports = require('./dist/runtime-dom.cjs.prod.js')
} else {                                     // development 开发环境
  module.exports = require('./dist/runtime-dom.cjs.js')
}

// require 是 commonjs的用法，用于动态引入文件，import是es的静态引用
```

```
分别查看dom的渲染入口文件
```

###### 2. node 升级

运行pnpm install不成功，需要升级node到18.0.1，使用nvm安装node，下载nvm.exe，运行nvm-v，检查nvm版本
nvm install 18, node 18.20.7LTS Long Term Support长期支持版
运行pnpm install未找到pnpm，使用npm install pnpm，安装pnpm，检查pnpm版本为10.4.1
使用pnpm install 软件依赖

###### 6. 创建一个vue项目，将其指向vue-next框架本地路径，在本地运行，浏览器中找到vue-runtime-dom.handler.js，设置断点

```
pnpm create vue@latest
git clone https://github.com/vuejs/core.git
pnpm install
pnpm build
修改本地项目路径中的package.json, dependencies-> vue:^3.5.13-> "vue": "./core/packages/vue",
pnpm install

Packages: +420
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  
Progress: resolved 463, reused 419, downloaded 1, added 420, done

dependencies:
+ pinia 3.0.1
+ vue 3.5.13 <- core\packages\vue
+ vue-router 4.5.0

安装成功
pnpm run dev 运行
启动本地路径
Local:   http://localhost:5173/
开启浏览器dev tools，查看core/packages/vue/dist/vue.runtime.esm-bundler.js
import { initCustomFormatter, warn } from '@vue/runtime-dom';
找到core/packages/runtime-dom/dist/runtime-dom.esm-bundler.js
设置断点。

渲染部分异常，重新安装vite3，新建一个自己写的框架，借鉴vue3的核心理念，大致了解每个模块的具体使用方法和功能。

```

###### 3. Vue Core.js 高层架构：从源码入口到页面渲染

Vue3 的整体结构，主要拆成 3 大块：
1️⃣ 响应式系统（Reactivity） 👉 packages/reactivity/
reactive()、ref()、effect()、computed()
负责数据响应式 & 依赖追踪

2️⃣ 运行时核心（Runtime-Core） 👉 packages/runtime-core/
组件的创建、挂载 & 更新
Diff 算法（VNode 比较 & Patch 机制）

3️⃣ 编译器（Compiler-Core） 👉 packages/compiler-core/
Vue 的 .vue 文件 → render() 函数
解析、转换、代码生成

###### 4.  Vue 源码的全局流程（从 createApp() 到页面渲染）

你打开 Vue3 项目，写 createApp(App).mount('#app')，Vue 内部发生了什么？
1️⃣ 应用启动 👉 createApp()（runtime-dom/index.ts）
创建 Vue 应用实例，调用 createRenderer() 初始化渲染器

2️⃣ 组件创建 & 渲染 👉 mount()（runtime-core/renderer.ts）
解析 App.vue 组件，调用 setup()，执行 render()

3️⃣ VNode 对比 & 更新 👉 patch()（runtime-core/patch.ts）
组件 -> VNode
旧 VNode vs. 新 VNode，执行 Diff 算法，最小化 DOM 更新

4️⃣ 响应式追踪 & 依赖触发 👉 track() & trigger()（reactivity/effect.ts）
reactive() 让数据变成 Proxy
effect() 监听数据变更，触发组件重新渲染

5️⃣ Vue 模板编译（仅在开发时使用） 👉 compiler-core/
.vue 模板 → parse() → transform() → generate() → render()

###### 5.  你现在该怎么解读 Vue 源码？

1️⃣ 先看 createApp()（runtime-dom/index.ts）
入口函数，看看它是如何初始化 Vue 应用的？

2️⃣ 再看 mount()（runtime-core/renderer.ts）
组件是怎么变成 VNode，并最终渲染成 DOM 的？

3️⃣ 跟踪 patch() 的执行（runtime-core/patch.ts）
Vue 是如何对比 VNode，决定该更新哪些 DOM？

4️⃣ 最后看 reactivity/ & compiler-core/
Vue3 的响应式是如何 work 的？
Vue3 是如何把 .vue 变成 render() 函数的？

###### 6. 配置vite3 vitest

安装 pnpm install vitest -D,

###### 7. createApp

* if(container.nodeType === 1) 枚举类型定义的第2个元素ELEMENT
* mount 挂载Vue组件或者应用
* if(container instanceof Element) 确保container是DOM元素
* container.removeAttribute("v-cloak") 让组件在加载后可见
* container.setAttribute("data-v-app","") 标记Vue应用的根节点
