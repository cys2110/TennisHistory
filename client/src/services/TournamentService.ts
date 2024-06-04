import axios from 'axios';
import { API_URL } from '@/components/utils';

const apiClient = axios.create({
    baseURL: `${API_URL}tournaments/`,
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

export default {
    getTournamentById(id: number) {
        return apiClient.get('id/' + id)
    }
}