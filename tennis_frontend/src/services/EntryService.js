import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/entries/',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

export default {
    getEntriesByEdition(id) {
        return apiClient.get('edition/' + id)
    }
}