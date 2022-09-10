<script lang="ts" setup>
  import { useInfiniteScroll } from '@bowencool/vhooks';
  import { fakePagingService } from '../use-paging/service';

  const defaultPageSize = 5;
  const { list, loading, loadingMore, error, done, empty, loadMore, refreshing, refresh } = useInfiniteScroll(
    fakePagingService,
    {
      defaultPageSize,
      isDone(res) {
        const currentQuantity: number = list.value?.length || 0;
        // 当前数量达到 total
        return currentQuantity >= res.total;
        // 当前响应数据不足一页
        // return res.list.length < defaultPageSize;
        // 接口告诉你了
        // return res.hasNextPage;
        // 默认 (不足一页 || 数量达到 total)
      },
    },
  );
</script>

<template>
  <button :disabled="loading" @click="loadMore">加载下一页</button>
  <button :disabled="loading" @click="refresh">刷新</button>
  <div v-if="refreshing">刷新中...</div>
  <template v-if="list">
    <div v-for="d in list" :key="d.id" :class="$style.infiniteListItem">{{ d.id }}</div>
  </template>
  <div v-if="loadingMore">加载中...</div>
  <div v-else-if="error">{{ error }}</div>
  <div v-else-if="empty">暂无数据</div>
  <div v-else-if="done">没有更多了</div>
</template>

<style module>
  .infiniteListItem {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    background: var(--el-color-primary-light-9);
    margin: 10px;
    color: var(--el-color-primary);
  }
</style>
