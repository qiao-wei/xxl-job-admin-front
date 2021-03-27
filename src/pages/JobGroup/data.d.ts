export type JobGroup = {
  id: number;
  appname: string;
  title: string;
  addressType: number;
  addressList: string;
  updateTime: string;
  registryList: string[];
};

export type QueryParam = {
  appname: string;
  title: string;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
