import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://tennis-history-backend-a82162895ecd.herokuapp.com/editions/',
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
    },
    getPlayerStats(player, year, surface) {
        return apiClient.get(`stats?player=${player}&year=${year}&surface=${surface}`)
    },
    getTiesByEdition(id) {
        return apiClient.get(`ties/${id}`)
    }
}