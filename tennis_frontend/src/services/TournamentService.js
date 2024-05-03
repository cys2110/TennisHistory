import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://tennis-history-backend-a82162895ecd.herokuapp.com/tournaments/',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

export default {
    getTournamentById(id) {
        return apiClient.get('id/' + id)
    }
}