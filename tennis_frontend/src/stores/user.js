import { defineStore } from 'pinia';
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const accessToken = ref(null)
    const refreshToken = ref(null)
    function setTokens(access, refresh) {
        accessToken.value = access
        refreshToken.value = refresh
    }
    return { accessToken, refreshToken, setTokens }
})

export const useLogin = defineStore('loggedIn', () => {
    const loggedIn = ref(false)
    function setLoggedIn(value) {
        loggedIn.value = !loggedIn.value
    }
    return { loggedIn, setLoggedIn }
})