<script lang="ts">
  import { TimeoutError } from '@bowencool/async-utilities';
  import { defineComponent } from 'vue';
  import { useAsyncState } from '@bowencool/vhooks';

  function queryService(keywords = '') {
    console.log('fetching', keywords);
    const delay = 0.2 + Math.random() * 2;
    return fetch(`https://httpbin.org/delay/${delay.toFixed(3)}?keywords=${keywords}`, {
      method: 'GET',
      mode: 'cors',
    }).then(() => `data for ${keywords} in ${Math.floor(delay * 1000)}ms`);
  }

  export default defineComponent({
    setup() {
      const { data, loading, error, run } = useAsyncState(queryService, {
        timeout: 1100,
        onError(err) {
          console.log(err.name, err instanceof TimeoutError);
        },
      });
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
  <el-button
    :loading="loading"
    type="primary"
    @click="
      () => {
        run('hello');
      }
    "
  >
    One More Time (Random delay)
  </el-button>
  <pre>data:
    <el-icon v-if="loading"><icon-loading /></el-icon>
    <span v-else-if="error">{{ error }}</span>
    <span v-else-if="data">{{ data }}</span>
    <span v-else>empty</span>
</pre>
</template>
