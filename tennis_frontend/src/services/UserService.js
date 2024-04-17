import axios from 'axios';
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';

const store = useUserStore()

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/users/',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

export default {
    login(user) {
        return apiClient.post('' + id)
    }
}