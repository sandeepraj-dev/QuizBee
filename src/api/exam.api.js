import API from './axios';

export const getExamsAPI = async classroomId => {
  const response = await API.get(`/exams/classroom/${classroomId}`);

  return response.data;
};
