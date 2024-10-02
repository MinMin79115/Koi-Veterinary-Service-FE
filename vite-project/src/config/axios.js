import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://14.225.206.168:8080/api/',
    baseURL: 'http://localhost:8080/api/v1/',
});

api.interceptors.request.use(config => {
    const token = sessionStorage.getItem('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
