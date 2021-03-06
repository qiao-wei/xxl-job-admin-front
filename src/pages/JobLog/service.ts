import request from '@/utils/request';
import type { QueryParam } from './data.d';

export async function queryLogs(params?: QueryParam) {
  return request('/rest/jobLogs', {
    params,
  });
}

export async function clearLogs(jobGroup?: number, jobId?: number, type?: number) {
  return request.delete('/rest/jobLogs?jobGroup=' + jobGroup + '&jobId=' + jobId + '&type=' + type);
}
