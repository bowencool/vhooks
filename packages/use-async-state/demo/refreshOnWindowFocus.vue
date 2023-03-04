<script lang="tsx">
  import type { VNodeChild } from 'vue';
  import { defineComponent } from 'vue';
  import { ElIcon } from 'element-plus';
  import { useAsyncState } from '@bowencool/vhooks';
  import { error2String } from './error2String';

  let count = 0;
  const queryService: () => Promise<number> = () =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(++count);
      }, 200);
    });

  export default defineComponent({
    setup() {
      const { data, loading, error } = useAsyncState(queryService, {
        refreshOnWindowFocus: true,
        focusTimespan: 5000,
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
          content = <span>{data.value}</span>;
        } else {
          content = <span>empty</span>;
        }
        return (
          <>
            <p>
              If you set <code>refreshOnWindowFocus = true</code>, the request will be refreshed when the browser window
              refocuses and revisible. You can set the request interval by setting <code>focusTimespan</code>, which
              defaults to 5000ms.
              <br />
              如果你设置了 refreshOnWindowFocus = true ，则在浏览器窗口 refocus 和 revisible
              时，会重新发起请求。你可以通过设置 focusTimespan 来设置请求间隔，默认为 5000ms 。
            </p>
            <pre>count: {content}</pre>
          </>
        );
      };
    },
  });
</script>
