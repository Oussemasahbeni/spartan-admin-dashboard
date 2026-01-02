export interface PaginatedResponse<T> {
  content: T[];
  total: number;
}

export interface TableQueryParams {
  pageIndex: number;
  pageSize: number;
  search: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}
