<script lang="ts">
  import { defineComponent } from 'vue';
  import { useAsyncState } from '@npm_bowen/vhooks';

  let count = 0;
  const queryService: () => Promise<{ count: number }> = () =>
    new Promise((r) => {
      setTimeout(() => {
        r({ count: ++count });
      }, 200);
    });

  export default defineComponent({
    name: 'Demo1',
    setup() {
      const { data, loading, error } = useAsyncState(queryService);
      return {
        data,
        loading,
        error,
      };
    },
  });
</script>

<template>
  <!-- 这个顺序可以达到 stale-while-revalidate 的效果 -->
  <pre>count:
    <span v-if="error">{{ error }}</span>
    <span v-else-if="data">{{ data.count }}</span>
    <el-icon v-else-if="loading"><icon-loading /></el-icon>
    <span v-else>empty</span>
</pre>
</template>
