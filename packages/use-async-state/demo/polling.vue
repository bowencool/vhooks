<script lang="tsx">
  import type { VNodeChild } from 'vue';
  import { defineComponent } from 'vue';
  import { ElIcon, ElButton } from 'element-plus';
  import { VideoPause, VideoPlay } from '@element-plus/icons-vue';
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
      const { data, loading, error, pause, resume } = useAsyncState(queryService, {
        pollingInterval: 1000,
        pollingWhenHidden: false,
      });
      return () => {
        let content: VNodeChild;
        if (data.value) {
          content = <span>{data.value}</span>;
        } else if (error.value) {
          content = <span>{error2String(error.value)}</span>;
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
            <p>通过 pollingInterval 设置轮询间隔。 通过 pollingWhenHidden 设置页面隐藏时自动暂停，页面重新显示时恢复</p>
            <ElButton type="info" onClick={pause} icon={VideoPause}>
              暂停
            </ElButton>
            <ElButton type="primary" onClick={resume} icon={VideoPlay}>
              恢复
            </ElButton>
            <pre>count: {content}</pre>
          </>
        );
      };
    },
  });
</script>
