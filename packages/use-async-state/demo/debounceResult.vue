<script lang="tsx">
  import type { VNodeChild } from 'vue';
  import { defineComponent } from 'vue';
  import { ElIcon } from 'element-plus';
  import { useAsyncState } from '@bowencool/vhooks';
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
        debounceResult: true,
        manual: true,
        onSuccess(rez, params) {
          console.log('onSuccess', rez, params);
        },
      });

      return () => {
        let content: VNodeChild;
        if (loading.value) {
          content = (
            <ElIcon>
              <icon-loading />
            </ElIcon>
          );
        } else if (error.value) {
          content = <span>{error2String(error.value)}</span>;
        } else if (data.value) {
          content = (
            <ul>
              {data.value?.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          );
        } else {
          content = <span>empty</span>;
        }
        return (
          <>
            <p>
              (When the execution frequency is too high or the execution time is uneven) Only takes the result of the
              last asynchronous task executed, recommend to enable. See more{' '}
              <a
                href="https://bowencool.github.io/async-utilities/functions/debounceAsyncResult/readme.html"
                target="_blank"
              >
                detail
              </a>
              .
              <br />
              （执行频率过高时或执行时间不均匀）取最后一次执行的异步任务结果，推荐开启。
              <a
                href="https://bowencool.github.io/async-utilities/functions/debounceAsyncResult/readme.html"
                target="_blank"
              >
                详情
              </a>
            </p>
            <input
              onInput={async function onInput(e) {
                // Note that code before 'await run' still executes
                // 注意在 `await run` 之前的代码仍会执行
                const keywords = (e.target as HTMLInputElement).value;
                // It gets stuck here at the right time
                // 会在适当的时机在此处卡住
                await run(keywords);
              }}
              type="text"
              placeholder="type something quickly"
              style="width: 300px"
            />
            {content}
          </>
        );
      };
    },
  });
</script>
