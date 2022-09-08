## Intro

useCopy 是对 [copy-rich-text](https://www.npmjs.com/package/copy-rich-text) 的一层状态封装。

## Demos

<demo src="./demo/demo1.vue" title="基本使用：传入文本" />

<demo src="./demo/demo3.vue" title="传入 ref、computed" />

<demo
  src="./demo/demo6.vue"
  title="html 字符串"
  desc="默认是其渲染后的样子，可以粘贴到 word 或富文本编辑器。"
/>

::: demo src="./demo/demo5.vue" title="指定 Dom 元素"

支持 `input` 、 `textarea` 等。

**不过要注意看清楚传入的是 `ref<DOM>` 还是 `ref<VueInstance>`，比如：**

```jsx
// inputRef 是一个 ref<VueInstance> 而不是 ref<DOM>
<el-input ref={inputRef} />
```

:::

## API

<details>
  <summary>查看代码</summary>

<<< es/use-copy/index.d.ts

</details>
