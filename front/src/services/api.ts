import axios, { type CreateAxiosDefaults} from "axios";


const option: CreateAxiosDefaults = {
    baseURL: 'http://localhost:8000/',
    headers: {
        'Content-Type': 'application/json'
    }
}

const api = axios.create(option)

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Обработка 401 ошибки (если токен истёк)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);



export { api }