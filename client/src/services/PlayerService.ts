import axios from 'axios';
import { API_URL } from '@/components/utils';

const apiClient = axios.create({
    baseURL: `${API_URL}players/`,
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

export default {
    getPlayerById(id: string) {
        return apiClient.get('id/' + id)
    },
    getPlayerIndex(id: string) {
        return apiClient.get('wl-index/' + id)
    },
    getPlayerByName(name: string) {
        return apiClient.get('name/' + name)
    },
    getTeamPlayersByEdition(id: string) {
        return apiClient.get(`ties/` + id)
    }
}