<script lang="ts">
  import { defineComponent } from 'vue';
  import { useAsyncState } from '@bowencool/vhooks';

  let count = 0;
  const queryService: () => Promise<{ count: number }> = () =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.5) {
          resolve({ count: ++count });
        } else {
          reject(new Error('Network Error'));
        }
      }, 200);
    });

  export default defineComponent({
    name: 'Demo2',
    setup() {
      const { data, loading, error, run } = useAsyncState(queryService, { manual: true });
      return {
        data,
        loading,
        error,
        run,
      };
    },
  });
</script>

<template>
  <el-button :loading="loading" type="primary" @click="run">Run manually (Random failure)</el-button>
  <pre>count:
    <el-icon v-if="loading"><icon-loading /></el-icon>
    <span v-else-if="error">{{ error }}</span>
    <span v-else-if="data">{{ data.count }}</span>
    <span v-else>empty</span>
</pre>
</template>
