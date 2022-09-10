## Intro

管理异步状态，通常用于网络请求。

Manages asynchronous state, typically for network requests.

> Vue 版 [ahooks/useRequest](https://ahooks.js.org/zh-CN/hooks/use-request/index)，高级功能有所出入。
>
> [ahooks/useRequest](https://ahooks.js.org/zh-CN/hooks/use-request/index) for Vue, there are some different in advanced features.

为什么不直接返回一个响应式对象？[因为响应式对象不能用解构语法](https://cn.vuejs.org/guide/extras/reactivity-transform.html#refs-vs-reactive-variables)。

Why not just return a reactive object? [Because reactive objects cannot use deconstructive syntax](https://vuejs.org/guide/extras/reactivity-transform.html#refs-vs-reactive-variables).

## Demos

<demo src="./demo/basic.vue" title="基本使用 Basic Usage" />

<demo src="./demo/manual.vue" title="手动调用和可选的错误视图 Invoke manually and optional error view" />

<demo src="./demo/polling.vue" file="./demo/error2String.ts" title="轮询 Polling" />

<demo src="./demo/refreshOnWindowFocus.vue" file="./demo/error2String.ts" title="屏幕聚焦重新请求 Refresh on window focus" />

<demo src="./demo/timeout.vue" title="超时 Timeout" />

<demo src="./demo/aborting.vue" title="手动停止 Aborting" />

<demo src="./demo/retry.vue" file="./demo/error2String.ts" title="自动重试 Auto retry" />

<demo src="./demo/loadingDelay.vue" title="防止 loading 闪烁 Prevent loading flicker" />

<demo src="./demo/debounce.vue" file="./demo/error2String.ts" title="防抖 Debounce" />

<demo src="./demo/debounceResult.vue" file="./demo/error2String.ts" title="对结果防抖 Debounce Result" />

<demo src="./demo/throttle.vue" file="./demo/error2String.ts" title="节流 Throttle" />

## Api

<details>
  <summary>查看代码</summary>

<<< es/use-async-state/index.d.ts

</details>
