import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://tennis-history-backend-a82162895ecd.herokuapp.com//search/',
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