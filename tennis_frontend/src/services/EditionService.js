import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/editions/',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

export default {
    getEditionById(id) {
        return apiClient.get('id/' + id)
    },
    getUpcomingEditions() {
        return apiClient.get('upcoming')
    },
    getEditionsByYear(year) {
        return apiClient.get('year/' + year)
    },
    getEditionsByPlayer(player) {
        return apiClient.get('player/' + player)
    },
    getEntriesByPlayer(player, year) {
        return apiClient.get(`entries?player=${player}&year=${year}`)
    },
    getMatchStats(id) {
        return apiClient.get(`match/${id}`)
    }
}