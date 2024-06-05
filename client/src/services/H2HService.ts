import axios from 'axios';
import { API_URL } from '@/components/utils';

const apiClient = axios.create({
    baseURL: `${API_URL}h2h`,
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

export default {
    h2h(p1: string, p2: string) {
        return apiClient.get(`?player1=${p1}&player2=${p2}`)
    }
}