import request from '@/utils/request';
import type { QueryParam, JobGroup } from './data.d';

export async function queryJobGroups(params?: QueryParam) {
  return request('/rest/jobGroups', {
    params,
  });
}

export async function queryMyJobGroups() {
  return request('/rest/jobGroups/i');
}

export async function saveJobGroup(jobGroup?: JobGroup) {
  console.log(jobGroup);
  if (jobGroup?.id) {
    return request.put('/rest/jobGroups/' + jobGroup?.id, { data: jobGroup });
  } else {
    return request.post('/rest/jobGroups', { data: jobGroup });
  }
}

export async function deleteJobGroup(id: Number) {
  return request.delete('/rest/jobGroups/' + id);
}
