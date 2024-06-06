import axios from 'axios'
import { API_URL } from '@/components/utils'

const apiClient = axios.create({
    baseURL: `${API_URL}editions/`,
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

export default {
    getEditionById(id: number) {
        return apiClient.get('id/' + id)
    },
    getUpcomingEditions() {
        return apiClient.get('upcoming')
    },
    getEditionsByYear(year: number) {
        return apiClient.get('year/' + year)
    },
    getEditionsByPlayer(player: string) {
        return apiClient.get('player/' + player)
    },
    getEntriesByPlayer(player: string, year: number) {
        return apiClient.get(`entries?player=${player}&year=${year}`)
    },
    getMatchStats(id: number) {
        return apiClient.get(`match/${id}`)
    },
    getPlayerStats(player: string, year: number | string, surface: string) {
        return apiClient.get(`stats?player=${player}&year=${year}&surface=${surface}`)
    },
    getTiesByEdition(id: number) {
        return apiClient.get(`ties/${id}`)
    }
}