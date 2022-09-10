import { computed, onMounted, reactive, ref } from 'vue';
import { throttleAsyncResult } from '@bowencool/async-utilities';
import type { PagingParamsDTO, PagingResultDTO, PagingService, UseAsyncStateOptions } from '@bowencool/vhooks';
import { useAsyncState } from '../use-async-state';

export type UseInfiniteScrollOptions<R> = UseAsyncStateOptions<PagingResultDTO<R>, [PagingParamsDTO /* & P */]> & {
  defaultPageSize?: number;
  isDone?: (res: PagingResultDTO<R>) => boolean;
};

export function useInfiniteScroll<RowType>(
  pagingService: PagingService<RowType>,
  { defaultPageSize: pageSize = 10, isDone, ...others }: UseInfiniteScrollOptions<RowType> = {},
) {
  const refreshing = ref(false);
  const done = ref(false);
  const list = ref<RowType[]>();
  const { data, error, loading, run } = useAsyncState(pagingService, {
    // debounceResult: true, // 这个 data 没有用到，所以不需要
    debounceInterval: 100,
    ...others,
    manual: true,
  });
  const state = reactive({
    pageNumber: 1,
  });

  // todo 正在加载下一页时，此时 refresh() 会失效，需要改进
  const loadData = throttleAsyncResult(async function (isRefresh = false) {
    if (done.value && !isRefresh) return;
    const oldList = list.value || [];
    const offset = isRefresh ? 0 : oldList.length;
    if (isRefresh) {
      state.pageNumber = 1;
      refreshing.value = true;
    }

    const payload = {
      pageSize,
      pageNumber: state.pageNumber,
      offset,
      count: pageSize,
    };
    console.log(`loadData${isRefresh ? '(refresh)' : ''}`, payload);

    try {
      const res = await run(payload);
      const newList = isRefresh ? res.list : oldList.concat(res.list);
      list.value = newList;
      console.log(`\tpage ${state.pageNumber}: (${offset}+${res.list.length})/${res.total}`, res);
      const isDoneF = isDone || ((r) => r.list.length < pageSize || newList.length >= r.total);
      done.value = isDoneF(res);
      state.pageNumber += 1;
    } finally {
      refreshing.value = false;
    }
  });

  onMounted(() => {
    loadData();
  });
  return {
    /** 原始响应 */
    rawData: data,
    /** 合并后的列表 */
    list,
    /** 正在刷新第一页的数据 */
    refreshing,
    /** 正在加载下一页的数据 */
    loadingMore: computed(() => loading.value && !refreshing.value),
    /** 正在请求接口 */
    loading,
    /** 接口错误 */
    error,
    /** 加载下一页的数据 */
    loadMore: () => loadData(),
    /** “暂无数据” */
    empty: computed(() => list.value?.length === 0 && !loading.value && done.value),
    /** 是否已经加载全部 */
    done,
    /** 刷新到第一页 */
    refresh: () => loadData(true),
  };
}
