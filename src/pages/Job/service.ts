import request from '@/utils/request';
import type { QueryParam, Job } from './data.d';

export async function queryJobs(params?: QueryParam) {
  return request('/rest/jobs', {
    params,
  });
}

export async function queryJobsByGroup(jobGroup?: number) {
  return request.get('/rest/jobs/all?jobGroup=' + jobGroup);
}

export async function saveJob(job?: Job) {
  // console.log(job);
  if (job?.id && job.id > 0) {
    return request.put('/rest/jobs/' + job?.id, { data: job });
  } else {
    return request.post('/rest/jobs', { data: job });
  }
}

export async function startJob(id: Number) {
  return request.post('/rest/jobs/' + id + '/start');
}

export async function stopJob(id: Number) {
  return request.post('/rest/jobs/' + id + '/stop');
}

export async function triggerJob(id: Number, triggerInfo: any) {
  return request.post('/rest/jobs/' + id + '/trigger', { data: triggerInfo });
}

export async function deleteJob(id: Number) {
  return request.delete('/rest/jobs/' + id);
}

export async function queryNextTriggerTimes(scheduleType: string, scheduleConf: string) {
  return request.get(
    '/rest/jobs/nextTriggerTimes?scheduleType=' + scheduleType + '&scheduleConf=' + scheduleConf,
  );
}
