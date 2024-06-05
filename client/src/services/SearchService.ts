import axios from 'axios';
import { API_URL } from '@/components/utils';

const apiClient = axios.create({
    baseURL: `${API_URL}search/`,
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

export default {
    search(searchTerm: string) {
        return apiClient.get('' + searchTerm)
    }
}