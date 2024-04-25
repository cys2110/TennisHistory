import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/players/',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

export default {
    getPlayerById(id) {
        return apiClient.get('id/' + id)
    },
    getPlayerIndex(id) {
        return apiClient.get('wlindex/' + id)
    },
    getPlayerStats(id, year, surface) {
        return apiClient.get('stats/' + id + `?year=${year}&surface=${surface}`)
    }
}