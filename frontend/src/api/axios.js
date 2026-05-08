import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://team-project-management-g3u2.onrender.com',
});

instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers['x-auth-token'] = token;
  return config;
});

export default instance;
