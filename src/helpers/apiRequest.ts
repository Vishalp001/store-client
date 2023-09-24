import axios from 'axios';

export enum REQUEST_TYPES {
  GET = 'get',
  POST = 'post',
  DELETE = 'delete',
  PUT = 'put',
}

type RequestConfig = {
  url: string;
  method: REQUEST_TYPES;
  headers?: {
    'Content-Type': string;
    Accept: string;
    Authorization?: string;
  };
  params?: {};
  body?: {};
};

export const APIRequest = (requestConfig: RequestConfig) => {
  const jwtJson = localStorage.getItem('jwt');
  const token = jwtJson ? JSON.parse(jwtJson) : '';
  const headers: RequestConfig['headers'] = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
    ...requestConfig.headers,
  };

  if (!token) delete headers.Authorization;

  return axios({
    method: requestConfig.method,
    url: requestConfig.url,
    headers: headers,
    params: requestConfig.params,
    data: requestConfig.body,
  });
};
