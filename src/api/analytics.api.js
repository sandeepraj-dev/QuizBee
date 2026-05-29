import API from './axios';

export const getDashboardAnalyticsAPI = async () => {
  const response = await API.get('/analytics/dashboard');
  return response.data;
};

export const getStudentAnalyticsAPI = async () => {
  const response = await API.get('/analytics/student');

  return response.data;
};
