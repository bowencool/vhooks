<script lang="ts">
  import { ElPagination } from 'element-plus';
  import { defineComponent } from 'vue';
  import { usePaging } from '@bowencool/vhooks';
  import { fakePagingService } from './service';

  export default defineComponent({
    components: { ElPagination },
    setup() {
      return usePaging(fakePagingService);
    },
  });
</script>

<template>
  <ElPagination v-bind="paginationState" background layout="total, sizes, prev, pager, next, jumper"></ElPagination>
  <pre>list:
<el-icon v-if="loading"><icon-loading /></el-icon>
<span v-else-if="error">{{ error }}</span>
<span v-else-if="list"><div v-for="d in list" :key="d.id">{{ d.id }}</div></span>
<span v-else>empty</span>
</pre>
</template>
