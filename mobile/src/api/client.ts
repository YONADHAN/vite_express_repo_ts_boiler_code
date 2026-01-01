import axios from 'axios';
import { API_URL } from '../constants';

// Create an Axios instance
const client = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for Cookies
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request Interceptor
client.interceptors.request.use(
  (config) => {
    // If you need to attach non-cookie tokens manually, do it here.
    // withCredentials: true usually handles the cookies automatically if the server sets them.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
client.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Token Expiry)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Implement refresh token logic here if needed
      // For cookie-based auth, often hitting a /refresh-token endpoint lets the server
      // set a new access cookie, then we retry the original request.

      // originalRequest._retry = true;
      // await client.post('/auth/refresh-token');
      // return client(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default client;
