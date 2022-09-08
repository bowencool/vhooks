<script lang="tsx">
  import type { VNodeChild } from 'vue';
  import { defineComponent } from 'vue';
  import { ElIcon } from 'element-plus';
  import { useAsyncState } from '@npm_bowen/vhooks';
  import { error2String } from './error2String';

  function searchApi(keywords = '') {
    console.log('fetching', keywords);
    const delay = (0.4 + Math.random() * 2).toFixed(3);
    return fetch(`https://httpbin.org/delay/${delay}?keywords=${keywords}`, {
      method: 'GET',
      mode: 'cors',
    }).then(() => [
      `suggestions1 for "${keywords}"`,
      `suggestions2 for "${keywords}"`,
      `suggestions3 for "${keywords}"`,
    ]);
  }

  export default defineComponent({
    setup() {
      const { data, loading, error, run } = useAsyncState(searchApi, {
        debounceInterval: 300,
        // debounceResult: true,
        manual: true,
      });

      return () => {
        let content: VNodeChild;
        if (error.value) {
          content = <span>{error2String(error.value)}</span>;
        } else if (data.value) {
          content = (
            <ul>
              {data.value?.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          );
        } else if (loading.value) {
          content = (
            <ElIcon>
              <icon-loading />
            </ElIcon>
          );
        } else {
          content = <span>empty</span>;
        }
        return (
          <>
            <p>
              通过设置 debounceInterval ，则进入防抖模式。此时如果频繁触发 run ，则会以防抖策略进行请求。推荐和
              debounceResult 一同开启。
            </p>
            <input
              onInput={async function onInput(e) {
                // 注意在 `await run` 之前的代码仍会执行
                const keywords = (e.target as HTMLInputElement).value;
                // 会在适当的时机在此处卡住
                await run(keywords);
              }}
              type="text"
              placeholder="打字打快点"
              style="width: 300px"
            />
            {content}
          </>
        );
      };
    },
  });
</script>
