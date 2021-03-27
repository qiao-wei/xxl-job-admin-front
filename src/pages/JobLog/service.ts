import request from '@/utils/request';
import type { QueryParam } from './data.d';

export async function queryLogs(params?: QueryParam) {
  return request('/rest/jobLogs', {
    params,
  });
}

export async function logCat(logId: number, triggerTime: number, executorAddress: string, fromLineNum: number) {
  return request.post('/rest/jobLogs/' + logId + '/cat?triggerTime=' + triggerTime +
    '&executorAddress=' + executorAddress +
    '&fromLineNum=' + fromLineNum);
}

export async function clearLogs(jobGroup?: number, jobId?: number, type?: number) {
  return request.delete('/rest/jobLogs?jobGroup=' + jobGroup + '&jobId=' + jobId + '&type=' + type);
}
