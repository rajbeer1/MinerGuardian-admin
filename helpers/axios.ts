import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3500',
});

export default axiosClient;