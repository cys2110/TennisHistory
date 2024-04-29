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
        return apiClient.get('wl-index/' + id)
    },
    getPlayerByName(name) {
        return apiClient.get('name/' + name)
    },
    getTeamPlayersByEdition(id) {
        return apiClient.get(`ties/` + id)
    }
}