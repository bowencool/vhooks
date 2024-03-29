<script lang="ts">
  import { AbortError } from '@bowencool/async-utilities';
  import { defineComponent } from 'vue';
  import { VideoPause, VideoPlay } from '@element-plus/icons-vue';
  import { useAsyncState } from '@bowencool/vhooks';

  let count = 0;
  const queryService: () => Promise<{ count: number }> = () =>
    new Promise((r) => {
      setTimeout(() => {
        r({ count: ++count });
      }, 2000);
    });

  export default defineComponent({
    name: 'Demo1',
    setup() {
      const { data, loading, error, run, cancel } = useAsyncState(queryService, {
        manual: true,
        onError(err) {
          console.log(err.name, err instanceof AbortError);
        },
      });
      return {
        data,
        loading,
        error,
        run,
        cancel,
        VideoPause,
        VideoPlay,
      };
    },
  });
</script>

<template>
  <el-button :loading="loading" type="primary" :icon="VideoPlay" @click="run">Run</el-button>
  <el-button :disabled="!loading" type="danger" plain :icon="VideoPause" @click="cancel">Cancel immediately</el-button>
  <pre>count:
    <el-icon v-if="loading"><icon-loading /></el-icon>
    <span v-else-if="error">{{ error }}</span>
    <span v-else-if="data">{{ data.count }}</span>
    <span v-else>empty</span>
</pre>
  <blockquote>
    <p>
      Should be run in the environment which support
      <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController" target="_blank">AbortController</a>
      .
      <br />
      需要运行环境支持
      <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController" target="_blank">AbortController</a>
      。
    </p>
    <p>
      Only the task status is intercepted. Services (such as http requests) that have already been executed cannot be
      revoked.
      <br />
      仅拦截任务状态，已经执行的service（如 http 请求）暂不支持撤销。
    </p>
  </blockquote>
</template>
