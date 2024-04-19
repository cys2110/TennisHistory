import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/search/',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

export default {
    search(searchTerm) {
        return apiClient.get('' + searchTerm)
    }
}