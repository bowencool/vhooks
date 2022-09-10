<script lang="ts" setup>
  import { useInfiniteScroll } from '@bowencool/vhooks';
  import { ElEmpty, ElInfiniteScroll as vInfiniteScroll } from 'element-plus';
  import { fakePagingService } from '../use-paging/service';
  import { error2String } from '../use-async-state/demo/error2String';

  const { list, loading, loadingMore, error, done, empty, loadMore, refreshing, refresh } = useInfiniteScroll(
    fakePagingService,
    {
      defaultPageSize: 5,
    },
  );
</script>

<template>
  <section
    v-infinite-scroll="loadMore"
    :infinite-scroll-disabled="done"
    :infinite-scroll-distance="50"
    :class="$style.infiniteList"
  >
    <div v-if="refreshing" class="text-center p-4">更新中...</div>
    <template v-if="list">
      <div v-for="d in list" :key="d.id" :class="$style.infiniteListItem">{{ d.id }}</div>
    </template>
    <div class="text-center text-gray-666 py-4">
      <div v-if="loadingMore">加载中...</div>
      <div v-else-if="error" key="error">
        <span class="text-alert">{{ error2String(error) }}</span>
      </div>
      <ElEmpty v-else-if="empty" description="暂无数据"></ElEmpty>
      <span v-else-if="done">没有更多了</span>
    </div>
  </section>
</template>

<style module>
  .infiniteList {
    height: 300px;
    overflow: auto;
    overflow: overlay;
  }

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
