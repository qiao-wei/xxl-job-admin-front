export type User = {
  id: number;
  username?: string;
  role: number;
  avatar: string;
  permission: string;
};

export type QueryParam = {
  username?: string;
  role?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};