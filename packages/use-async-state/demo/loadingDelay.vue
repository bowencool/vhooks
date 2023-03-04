<script lang="tsx">
  import type { VNodeChild } from 'vue';
  import { defineComponent } from 'vue';
  import { ElIcon } from 'element-plus';
  import { useAsyncState } from '@bowencool/vhooks';

  const queryService: () => Promise<number> = () =>
    new Promise((resolve) => {
      // console.log('start', Date.now());
      setTimeout(() => {
        const now = Date.now();
        // console.log('end', now);
        resolve(now);
      }, 100);
    });

  export default defineComponent({
    setup() {
      const getTimeAction = useAsyncState(queryService, {
        // manual: true,
        pollingInterval: 1000,
      });
      const withLoadingDelayAction = useAsyncState(queryService, {
        // manual: true,
        pollingInterval: 1000,
        loadingDelay: 200,
      });
      return () => {
        let content = <span>{getTimeAction.data.value || 'empty'}</span>;
        if (getTimeAction.loading.value) {
          content = (
            <ElIcon>
              <icon-loading />
            </ElIcon>
          );
        } else if (getTimeAction.error.value) {
          content = <span>{getTimeAction.error.value}</span>;
        }
        let withLoadingDelayActionContent = <span>{withLoadingDelayAction.data.value || 'empty'}</span>;
        if (withLoadingDelayAction.loading.value) {
          withLoadingDelayActionContent = (
            <ElIcon>
              <icon-loading />
            </ElIcon>
          );
        } else if (withLoadingDelayAction.error.value) {
          withLoadingDelayActionContent = <span>{withLoadingDelayAction.error.value}</span>;
        }

        let contentWithSWR: VNodeChild;
        if (getTimeAction.data.value) {
          contentWithSWR = <span>{getTimeAction.data.value}</span>;
        } else if (getTimeAction.error.value) {
          contentWithSWR = <span>{getTimeAction.error.value}</span>;
        } else if (getTimeAction.loading.value) {
          contentWithSWR = (
            <ElIcon>
              <icon-loading />
            </ElIcon>
          );
        } else {
          contentWithSWR = <span>empty</span>;
        }

        return (
          <>
            <p>
              You can set <code>loadingDelay</code> to delay the loading came true to prevent flickering. <br />
              通过设置 loadingDelay，可以延迟 loading 变成 true 的时间，有效防止闪烁。
            </p>
            <pre>Default: {content}</pre>
            <pre>200ms loadingDelay: {withLoadingDelayActionContent}</pre>
            <pre>SWR : {contentWithSWR}</pre>
          </>
        );
      };
      // return {
      //   data,
      //   loading,
      //   error,
      // };
    },
  });
</script>
