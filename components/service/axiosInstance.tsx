import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://api.7uniqueverfiy.com/api',
    // baseURL: 'http://localhost:5050/api', 
    // headers: {
    //     'Content-Type': 'application/json',
    // },
});

// ✅ Request Interceptor — safely set token only in browser
axiosInstance.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized! Redirecting to login...');
            // You can redirect user or remove token here
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
