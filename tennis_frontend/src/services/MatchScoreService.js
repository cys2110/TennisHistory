import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/match-scores/',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

export default {
    getMatchesByEdition(id) {
        return apiClient.get('edition/' + id)
    }
}