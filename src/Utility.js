import axios from 'axios';
export const Axios = axios.create({
  // baseURL: 'http://localhost:8080/api',
  baseURL: 'https://dd-server-production.up.railway.app/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    // Authorization: localStorage.getItem('ltk') || '',
  },
  maxContentLength: 20 * 1000 * 1000, // bytes => 5 MB
});
