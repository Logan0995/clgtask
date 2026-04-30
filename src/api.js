import axios from 'axios';
import { message } from 'antd';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error("API Error:", error);
        // We let the component handle specific errors, but we can return a rejected promise safely
        return Promise.reject(error);
    }
);

export default API;
