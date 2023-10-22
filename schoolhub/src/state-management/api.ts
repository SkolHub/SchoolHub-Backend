import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
});

api.interceptors.request.use(
  (config) => {
    const session = localStorage.getItem('token');

    if (session !== null) {
      config.headers.Authorization = session;
    }

    return config;
  },
  
  (error) => {
    return Promise.reject(error);
  }
);

export default api;