import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://tennis-history-backend-a82162895ecd.herokuapp.com/players/',
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