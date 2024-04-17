<script setup>
import BaseInput from '@/components/BaseForm/BaseInput.vue';
import SignupService from '@/services/SignupService';
import UserService from '@/services/UserService';
import { useLogin } from '@/stores/user';
import { ref } from 'vue';

const initialForm = {
    username: '',
    password: ''
}

const loginForm = ref(initialForm)
const store = useLogin()

const submitForm = () => {
    SignupService.login(loginForm.value)
    .then(response => {
        localStorage.setItem('accessToken', response.data.access)
        localStorage.setItem('refreshToken', response.data.refresh)
        store.setLoggedIn(true)
        UserService.username(loginForm.value.username)
        .then(response => {
            localStorage.setItem('username', response.data[0].username)
            localStorage.setItem('userId', response.data[0].id)
        })
        .catch(error => console.log(error))
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