## Intro

管理异步状态，通常用于网络请求。

> 模仿 [ahooks/useRequest](https://ahooks.js.org/zh-CN/hooks/async/#userequest) 的低配版。

为什么不直接返回一个响应式对象？[因为响应式对象不能用解构语法](https://v3.cn.vuejs.org/guide/reactivity-fundamentals.html#%E5%93%8D%E5%BA%94%E5%BC%8F%E7%8A%B6%E6%80%81%E8%A7%A3%E6%9E%84)。

## Demos

<demo src="./demo/demo1.vue" />

<demo src="./demo/demo2.vue" title="手动执行 + 错误提示" />

<demo src="./demo/demo3.vue" title="轮询" />

<demo src="./demo/demo11.vue" title="屏幕聚焦重新请求" />

<demo src="./demo/demo9.vue" title="超时" />

<demo src="./demo/demo10.vue" title="手动停止" />

<demo src="./demo/demo8.vue" title="自动重试" />

<demo src="./demo/demo4.vue" title="防止 loading 闪烁" />

<demo src="./demo/demo5.vue" title="防抖" />

<demo src="./demo/demo6.vue" title="对结果防抖" />

<demo src="./demo/demo7.vue" title="节流" />

## Api

<details>
  <summary>查看代码</summary>

<<< es/use-async-state/index.d.ts

</details>
