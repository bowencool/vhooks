import { promiseTimeout } from '@vueuse/core';
import { computed, onMounted, reactive } from 'vue';
import type { UseAsyncStateOptions } from '../use-async-state';
import { useAsyncState } from '../use-async-state';

export * from './types';

import type { PagingParamsDTO, PagingResultDTO, PagingService } from './types';

export type UsePagingOption<R> = UseAsyncStateOptions<PagingResultDTO<R>, [PagingParamsDTO /* & P */]> & {
  defaultPageSize?: number;
};

export function usePaging<RowType /*  P extends Record<string, any> */>(
  pagingService: PagingService<RowType /* P */>,
  { defaultPageSize = 10, ...others }: UsePagingOption<RowType> = {},
) {
  const { data, error, loading, run } = useAsyncState(pagingService, {
    debounceResult: true,
    debounceInterval: 100,
    ...others,
    manual: true,
  });
  const paginationState = reactive({
    total: 0,
    currentPage: 1,
    pageSize: defaultPageSize,
    'onUpdate:currentPage': async function (pageNumber: number) {
      const { pageSize } = paginationState;
      const rez = await run({ pageSize, pageNumber, offset: pageSize * (pageNumber - 1), count: pageSize });
      paginationState.currentPage = pageNumber;
      paginationState.pageSize = pageSize;
      paginationState.total = rez.total;
    },
    'onUpdate:pageSize': async function (pageSize: number) {
      const rez = await run({ pageSize, pageNumber: 1, offset: 0, count: pageSize });
      paginationState.currentPage = 1;
      paginationState.pageSize = pageSize;
      paginationState.total = rez.total ?? 0;
    },
  });

  // after effects
  const goPage = (n: number) => promiseTimeout(0).then(() => paginationState['onUpdate:currentPage'](n));
  onMounted(() => {
    goPage(1);
  });

  return {
    list: computed(() => data.value?.list),
    paginationState,
    goPage,
    rawData: data,
    loading,
    error,
  };
}
