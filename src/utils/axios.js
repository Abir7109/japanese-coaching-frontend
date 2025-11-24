import axios from 'axios';

// Set base URL based on environment
const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

axios.defaults.baseURL = baseURL;
// Do not set a global default for post Content-Type so FormData can set its own boundary
// axios.defaults.headers.post['Content-Type'] = 'application/json';

// Add request interceptor
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If sending FormData, let the browser set the Content-Type (with boundary)
    if (config.data instanceof FormData) {
      if (config.headers && config.headers['Content-Type']) {
        delete config.headers['Content-Type'];
      }
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
      if (window?.location) {
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
