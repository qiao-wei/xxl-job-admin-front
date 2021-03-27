export type Job = {
  id?: number;
  jobGroup: number;
  jobDesc: string;
  addTime: Date;
  updateTime: Date;
  author: string;
  alarmEmail: string;
  scheduleType: string;
  scheduleConf: string;
  misfireStrategy: string;
  executorRouteStrategy: string;
  executorHandler: string;
  executorParam: string;
  executorBlockStrategy: string;
  executorTimeout: number;
  executorFailRetryCount: number;
  glueType: string;
  glueSource: string;
  glueRemark: string;
  glueUpdatetime: Date;
  childJobId: string;
  triggerStatus: number;
  triggerLastTime: number;
  triggerNextTime: number;
};

export type QueryParam = {
  username?: string;
  role?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
