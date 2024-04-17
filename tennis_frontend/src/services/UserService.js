import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/api/token/',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

export default {
    login(user) {
        return apiClient.post('', user)
    }
}