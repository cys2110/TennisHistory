import axios from 'axios';
import { useRouter } from 'vue-router';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

apiClient.interceptors.request.use(
    async config => {
        const accessToken = localStorage.getItem('accessToken')
        const refreshToken = localStorage.getItem('refreshToken')

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
            return config
        }

        if (refreshToken) {
            try {
                const response = await axios.post('api/token/refresh/', {refreshToken})
                const newAccessToken = response.data.access
                localStorage.setItem('accessToken', newAccessToken)
                config.headers.Authorization = `Bearer ${newAccessToken}`
            } catch (error) {
                console.error(error)
                const router = useRouter()
                router.push({name: 'Login'})
            }
        }

        console.error('No access token or refresh token available')
    },
    error => {
        const router = useRouter()
        router.push({name: 'Login'})
        return Promise.reject(error)
    }
)

export default {
    login(id) {
        return apiClient.get('users/' + id + '/')
    },
    edit(id, user) {
        return apiClient.patch('users/' + id + '/', user)
    },
    delete(id) {
        return apiClient.delete('users/' + id + '/')
    },
    username(username) {
        return apiClient.get('user/username/' + username + '/')
    }
}