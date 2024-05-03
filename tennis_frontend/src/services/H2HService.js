import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://tennis-history-backend-a82162895ecd.herokuapp.com/h2h',
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