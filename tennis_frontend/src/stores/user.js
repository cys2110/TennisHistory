import { defineStore } from 'pinia';
import { ref } from 'vue'

export const useLogin = defineStore('loggedIn', () => {
    const loggedIn = ref(!!localStorage.username)
    function setLoggedIn() {
        loggedIn.value = !loggedIn.value
    }
    return { loggedIn, setLoggedIn }
})