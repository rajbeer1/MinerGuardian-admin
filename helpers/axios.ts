import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://api.rajbeer.tech',
});

export default axiosClient;
