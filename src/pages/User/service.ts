import request from '@/utils/request';
import type { QueryParam, User } from './data.d';

export async function queryUsers(params?: QueryParam) {
  return request('/rest/users', {
    params,
  });
}

export async function saveUser(user?: User) {
  console.log(user);
  if (user?.id) {
    return request.put('/rest/users/' + user?.id, { data: user });
  } else {
    return request.post('/rest/users', { data: user });
  }
}

export async function deleteUser(id: Number) {
  return request.delete('/rest/users/' + id);
}
