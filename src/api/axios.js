import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { authStore } from '../store/authStore';

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * REQUEST INTERCEPTOR
 */
API.interceptors.request.use(
  async config => {
    try {
      const token = authStore.getState().token;

      if (token) {
        // Remove unwanted quotes/spaces
        const cleanToken = token.replace(/"/g, '').trim();

        config.headers.Authorization = `Bearer ${cleanToken}`;
      } else {
        console.log('❌ NO TOKEN FOUND');
      }

      return config;
    } catch (error) {
      console.log('❌ REQUEST INTERCEPTOR ERROR =>', error);

      return Promise.reject(error);
    }
  },
  error => {
    console.log('❌ REQUEST SETUP ERROR =>', error);

    return Promise.reject(error);
  },
);

/**
 * RESPONSE INTERCEPTOR
 */
API.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.log('ERROR MESSAGE =>', error.message);

    if (error.config) {
      console.log(
        'FAILED URL =>',
        `${error.config.baseURL}${error.config.url}`,
      );

      console.log('FAILED METHOD =>', error.config.method?.toUpperCase());
    }

    // Server responded with error
    if (error.response) {
      console.log('STATUS =>', error.response.status);

      console.log('ERROR RESPONSE =>', error.response.data);
    }

    // Request made but no response
    else if (error.request) {
      console.log('❌ NO RESPONSE RECEIVED');

      console.log('REQUEST =>', error.request);
    }

    // Something else
    else {
      console.log('❌ UNKNOWN ERROR =>', error);
    }

    console.log('================================\n');

    return Promise.reject(error);
  },
);

export default API;
