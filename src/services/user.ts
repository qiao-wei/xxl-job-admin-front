/**
 * 获取当前登录用户的信息 全局使用
 */
import request from '@/utils/request';

export async function queryCurrent(): Promise<any> {
  return request('/rest/users/i');
}

export async function queryNotices(): Promise<any> {
  return [];
  // return request('/api/notices');
}
