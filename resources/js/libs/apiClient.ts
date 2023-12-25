import axios from "axios"

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem("token")}`
}

const apiClient = axios.create({
    baseURL: import.meta.env.APP_URL,
    responseType: 'json',
    headers,
})


apiClient.interceptors.request.use(config => {
    const accessToken = localStorage.getItem("token");

    //checking if accessToken exists
    if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
});

export default apiClient
