import request from '@/utils/request';

export type LoginParamsType = {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
};

export async function userLogin(params: LoginParamsType) {
  return request('/rest/login', {
    method: 'POST',
    data: params,
  });
}

export async function userLogout() {
  return request('/rest/logout', {
    method: 'POST',
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
