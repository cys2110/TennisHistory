import { defineStore } from 'pinia';
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
    const tokens = ref(null)
    function setTokens(value) {
        tokens.value = value
    }
    return { tokens, setTokens }
})