import API from './axios';

export const loginAPI = async data => {
  const response = await API.post('/auth/login', data);
  return response.data;
};

export const registerAPI = async data => {
  const response = await API.post('/auth/register', data);
  return response.data;
};
