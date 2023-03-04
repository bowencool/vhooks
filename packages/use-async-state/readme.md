## Intro

Manages asynchronous state, typically for network requests.

管理异步状态，通常用于网络请求。

> [ahooks/useRequest](https://ahooks.js.org/zh-CN/hooks/use-request/index) for Vue, advanced features are implemented according to [@bowencool/async-utilities](https://bowencool.github.io/async-utilities/).
>
> Vue 版 [ahooks/useRequest](https://ahooks.js.org/zh-CN/hooks/use-request/index)，高级功能根据 [@bowencool/async-utilities](https://bowencool.github.io/async-utilities/) 实现。

Why not just return a reactive object? [Because reactive objects cannot use deconstructive syntax](https://vuejs.org/guide/extras/reactivity-transform.html#refs-vs-reactive-variables).

为什么不直接返回一个响应式对象？[因为响应式对象不能用解构语法](https://cn.vuejs.org/guide/extras/reactivity-transform.html#refs-vs-reactive-variables)。

## Demos

<demo src="./demo/basic.vue" title="Basic Usage 基本使用" />

<demo src="./demo/manual.vue" title="Invoke manually and optional error view 手动调用和可选的错误视图" />

<demo src="./demo/polling.vue" file="./demo/error2String.ts" title="Polling 轮询" />

<demo src="./demo/refreshOnWindowFocus.vue" file="./demo/error2String.ts" title="Refresh on window focus 屏幕聚焦重新请求" />

<demo src="./demo/timeout.vue" title="Timeout 超时" />

<demo src="./demo/aborting.vue" title="Aborting 手动停止" />

<demo src="./demo/retry.vue" file="./demo/error2String.ts" title="Auto retry 自动重试" />

<demo src="./demo/loadingDelay.vue" title="Prevent loading flicker 防止 loading 闪烁" />

<demo src="./demo/debounce.vue" file="./demo/error2String.ts" title="Debounce 防抖" />

<demo src="./demo/debounceResult.vue" file="./demo/error2String.ts" title="Debounce Result 对结果防抖" />

<demo src="./demo/throttle.vue" file="./demo/error2String.ts" title="Throttle 节流" />

## Api

<details>
  <summary>View Codes 查看代码</summary>

<<< es/use-async-state/index.d.ts

</details>
