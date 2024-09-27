import axios from 'axios';
import secureLocalStorage from 'react-secure-storage';

const api = axios.create({
    baseURL: 'http://14.225.220.131:8080/api/',
});

api.interceptors.request.use(config => {
    const token = secureLocalStorage.getItem('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
