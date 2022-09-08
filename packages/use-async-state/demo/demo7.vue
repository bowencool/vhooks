<script lang="tsx">
  import type { VNodeChild } from 'vue';
  import { defineComponent } from 'vue';
  import { ElIcon } from 'element-plus';
  import { useAsyncState } from 'vhooks';
  import { error2String } from './error2String';

  function service(keywords: string) {
    console.log('提交中...', keywords);
    const delay = (0.4 + Math.random() * 2).toFixed(3);
    return fetch(`https://httpbin.org/delay/${delay}?keywords=${keywords}`, {
      method: 'GET',
      mode: 'cors',
    }).then(() => ({
      data: `提交成功，提交数据为 ${keywords}`,
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
        let content: VNodeChild = JSON.stringify(data.value) || 'empty';
        if (loading.value) {
          content = (
            <ElIcon>
              <icon-loading />
            </ElIcon>
          );
        } else if (error.value) {
          content = <span>{error2String(error.value)}</span>;
        }
        return (
          <>
            <p>
              返回第一次执行的异步任务结果并忽略在此期间的任何执行。
              <a
                href="https://bowencool.github.io/async-utilities/functions/throttleAsyncResult/readme.html"
                target="_blank"
              >
                详情
              </a>
            </p>
            <p>
              换句话说，你不需要有<code>if (loading) return;</code>这种心智负担。
            </p>
            <p>我觉得 throttleResult 完全可以取代 throttleInterval, 所以暂时不会开发 throttleInterval </p>
            <el-button
              type="primary"
              onClick={async () => {
                await run('abc');
              }}
            >
              提交或查询（快速点击）
            </el-button>
            <pre>{content}</pre>
          </>
        );
      };
    },
  });
</script>
