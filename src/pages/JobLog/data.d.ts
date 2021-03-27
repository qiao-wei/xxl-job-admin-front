export type JobLog = {
  id: number;
  jobGroup: number;
  jobId: number;
  executorAddress: null;
  executorHandler: string;
  executorParam: string;
  executorShardingParam: null;
  executorFailRetryCount: number;
  triggerTime: string;
  triggerCode: number;
  triggerMsg: string;
  handleTime: string;
  handleCode: number;
  handleMsg: string;
  alarmStatus: number;
};

export type QueryParam = {
  jobGroup?: number;
  jobId?: number;
  logStatus?: number;
  filterTime?: string;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
