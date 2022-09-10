<script lang="ts">
  import { defineComponent } from 'vue';
  import { useAsyncState } from '@bowencool/vhooks';

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
  <pre>count:
    <span v-if="error">{{ error }}</span>
    <el-icon v-else-if="loading"><icon-loading /></el-icon>
    <span v-else-if="data">{{ data.count }}</span>
    <span v-else>empty</span>
</pre>
</template>
