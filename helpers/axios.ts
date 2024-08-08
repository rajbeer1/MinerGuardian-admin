import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://sih-backend-v3m4.onrender.com',
});

export default axiosClient;
