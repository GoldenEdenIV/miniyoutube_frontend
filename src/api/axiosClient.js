import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://miniyoutube-api.azurewebsites.net', // Đổi port nếu backend chạy port khác
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Tự động gắn Token vào mỗi request nếu có
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;