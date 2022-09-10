// export type SortOrder = 'ascending' | 'descending';

export interface PagingParamsDTO {
  pageNumber: number;
  pageSize: number;
  offset: number;
  count: number;
  // sortField?: string;
  // sortOrder?: SortOrder;
  [k: string]: any;
}
export type PagingResultDTO<R> = {
  total: number;
  list: R[];
  [k: string]: any;
};
export interface PagingService<R /* , P extends Record<string, any> = Record<string, any> */> {
  (p: Record<string, any> /* PagingParamsDTO */ /* & P */): Promise<PagingResultDTO<R>>;
}
