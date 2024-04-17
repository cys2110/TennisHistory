<script setup>
import BaseInput from '@/components/BaseForm/BaseInput.vue';
import SignupService from '@/services/SignupService';
import { useLogin, useUserStore } from '@/stores/user';
import { ref } from 'vue';

const store = useUserStore()
const loginStore = useLogin()

const initialForm = {
    username: '',
    password: ''
}

const loginForm = ref(initialForm)

const submitForm = () => {
    SignupService.login(loginForm.value)
    .then(response => {
        store.setTokens(response.data.access, response.data.refresh)
        loginStore.setLoggedIn()
        loginForm.value = initialForm
    })
    .catch(error => console.log(error))
}
</script>

<template>
    <form @submit.prevent="submitForm">
        <BaseInput type="text" placeholder="Username" v-model="loginForm.username" />
        <BaseInput type="text" placeholder="Password" v-model="loginForm.password" />
        <button type="submit">Submit</button>
    </form>
</template>