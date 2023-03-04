<script lang="tsx">
  import { ElButton, ElIcon } from 'element-plus';
  import type { VNodeChild } from 'vue';
  import { ref, defineComponent } from 'vue';
  import { useAsyncState } from '@bowencool/vhooks';
  import { error2String } from './error2String';

  function getUnstableApi(keywords: string) {
    console.log('fetching', keywords);
    return fetch(`https://httpbin.org/status/200,500,400?keywords=${keywords}`, {
      method: 'GET',
      mode: 'cors',
    }).then((res) => {
      if (res.status >= 200 && res.status < 300) {
        return {
          data: `result for ${keywords}`,
        };
      }
      throw new Error(res.statusText || `request failed with status ${res.status}`);
    });
  }

  export default defineComponent({
    setup() {
      const logs = ref<string[]>([]);
      const { data, loading, error, run } = useAsyncState(getUnstableApi, {
        defaultParams: ['hello'],
        autoRetry: {
          maxCount: 3,
          retryInterval: 1000,
          onRetry(i) {
            logs.value.push(`${Date.now()} The attempt ${i} is under way...`);
          },
          onFailed(i, [err]) {
            logs.value.push(`${Date.now()} The attempt ${i} failed：${error2String(err)}`);
          },
        },
        onSuccess(rez, params) {
          logs.value.push(
            `${Date.now()} onSuccess: \n\trez: ${JSON.stringify(rez)} \n\tparams: ${JSON.stringify(params)}`,
          );
        },
        onError(err, params) {
          logs.value.push(`${Date.now()} onError: \n\trez: ${error2String(err)} \n\tparams: ${JSON.stringify(params)}`);
        },
        onComplete(params) {
          logs.value.push(`${Date.now()} onComplete: \n\tparams: ${JSON.stringify(params)}`);
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
            <ElButton
              type="primary"
              loading={loading.value}
              onClick={async () => {
                logs.value = [];
                await run('abc');
              }}
            >
              Query (Random failure)
            </ElButton>
            <pre>{content}</pre>
            <pre>{logs.value.join('\n')}</pre>
          </>
        );
      };
    },
  });
</script>
