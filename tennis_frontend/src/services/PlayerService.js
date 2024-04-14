import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/players/',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

export default {
    getPlayerById(id) {
        return apiClient.get('' + id)
    }
}