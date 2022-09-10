import type { PagingService } from './types';

type ItemDTO = { id: number };

export const fakePagingService: PagingService<ItemDTO> = (query) =>
  new Promise((r, j) => {
    setTimeout(() => {
      try {
        const total = 33;
        const list: ItemDTO[] = [];
        const start = (query.pageNumber - 1) * query.pageSize + 1;
        for (let i = start; i < start + query.pageSize; i++) {
          if (i > total) break;
          list.push({ id: i });
        }
        r({ total, list });
      } catch (er) {
        j(er);
      }
    }, 300);
  });
