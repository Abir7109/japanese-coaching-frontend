import axios from 'axios';

// Set base URL based on environment
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

axios.defaults.baseURL = baseURL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Add request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axios;
