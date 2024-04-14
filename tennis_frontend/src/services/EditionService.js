import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/editions/',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

export default {
    getUpcomingEditions() {
        return apiClient.get('upcoming')
    },
    getEditionsByYear(year) {
        return apiClient.get('year/' + year)
    }
}