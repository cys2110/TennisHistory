import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8000/users/',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

const logInClient = axios.create({
    baseURL: 'http://localhost:8000/api/token/',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

export default {
    signup(user) {
        return apiClient.post('', user)
    },
    login(user) {
        return logInClient.post('', user)
    }
}