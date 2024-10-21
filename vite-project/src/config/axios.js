import axios from 'axios';
<<<<<<< HEAD
import secureLocalStorage from 'react-secure-storage';

const api = axios.create({
    baseURL: 'http://14.225.220.131:8080/api/',
});

api.interceptors.request.use(config => {
    const token = secureLocalStorage.getItem('userToken');
=======

const api = axios.create({
    // baseURL: 'http://14.225.206.168:8080/api/',
    baseURL: 'http://localhost:8080/api/v1/',
});

api.interceptors.request.use(config => {
    const token = sessionStorage.getItem('token');
>>>>>>> be0869eaf5d981e5045dbd09818a5d79b2d28ac0
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
