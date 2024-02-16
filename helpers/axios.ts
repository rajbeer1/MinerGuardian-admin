import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3200',
});

export default axiosClient;