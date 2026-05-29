import API from './axios';

export const getClassroomsAPI = async () => {
  const response = await API.get('/classrooms');
  return response.data;
};
