import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/h2h',
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
})

export default {
    h2h(p1, p2) {
        return apiClient.get(`?player1=${p1}&player2=${p2}`)
    }
}