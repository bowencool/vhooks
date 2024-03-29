<script lang="tsx">
  import type { VNodeChild } from 'vue';
  import { defineComponent } from 'vue';
  import { ElIcon } from 'element-plus';
  import { useAsyncState } from '@bowencool/vhooks';
  import { error2String } from './error2String';

  function service(keywords: string) {
    console.log('Submitting...', keywords);
    const delay = (0.4 + Math.random() * 2).toFixed(3);
    return fetch(`https://httpbin.org/delay/${delay}?keywords=${keywords}`, {
      method: 'GET',
      mode: 'cors',
    }).then(() => ({
      data: `Success! Your data is: ${keywords}`,
    }));
  }

  export default defineComponent({
    setup() {
      const { data, loading, error, run } = useAsyncState(service, {
        throttleResult: true,
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
          content = <span>{JSON.stringify(data.value)}</span>;
        } else {
          content = <span>empty</span>;
        }
        return (
          <>
            <p>
              Take the result of the first execution of the asynchronous task and ignores any executions in the
              meantime. See more{' '}
              <a
                href="https://bowencool.github.io/async-utilities/functions/throttleAsyncResult/readme.html"
                target="_blank"
              >
                detail
              </a>
              .
              <br />
              返回第一次执行的异步任务结果并忽略在此期间的任何执行。
              <a
                href="https://bowencool.github.io/async-utilities/functions/throttleAsyncResult/readme.html"
                target="_blank"
              >
                详情
              </a>
            </p>
            <p>
              You don't need to have mental burden like <code>if (loading) return; </code>.<br />
              换句话说，你不需要有<code>if (loading) return;</code>这种心智负担。
            </p>

            <p>
              I won't develop <code>throttleInterval</code> for the time being because I think
              <code>throttleResult</code> can totally cover it.
              <br /> 我觉得 throttleResult 完全可以取代 throttleInterval, 所以暂时不会开发 throttleInterval 。
            </p>
            <el-button
              type="primary"
              onClick={async () => {
                await run('abc');
              }}
            >
              Submit or Query (Click quickly)
            </el-button>
            <pre>{content}</pre>
          </>
        );
      };
    },
  });
</script>
