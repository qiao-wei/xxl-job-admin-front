import request from '@/utils/request';
// import user from 'mock/user';
import type { QueryParam, User } from './data.d';

export async function queryUsers(params?: QueryParam) {
  const result = await request('/rest/users', {
    params,
  });

  const { content } = result;

  // console.log(content);
  if (content !== null) {
    const { data } = content;
    for (let u of data) {
      const ps = [];
      const { permission } = u;
      // console.log(permission)
      if (permission !== null) {
        for (let s of permission.split(',')) {
          ps.push(parseInt(s));
        }
      }

      u.permission = ps;
    }

    // console.log(content);
  }

  return result;
}

export async function saveUser(user?: any) {
  const { permission } = user;
  if (permission !== null) {
    let str = '';
    for (let s of permission) {
      str += s + ',';
    }

    if (str.length > 0) {
      str = str.substr(0, str.length - 1);
    }

    user.permission = str;
  }
  // console.log(user);

  if (user?.id) {
    return request.put('/rest/users/' + user?.id, { data: user });
  } else {
    return request.post('/rest/users', { data: user });
  }
}

export async function deleteUser(id: Number) {
  return request.delete('/rest/users/' + id);
}
