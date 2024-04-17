<script setup>
import BaseInput from '@/components/BaseForm/BaseInput.vue';
import SignupService from '@/services/SignupService';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const initialForm = {
    username: '',
    password: ''
}

const loginForm = ref(initialForm)

const submitForm = () => {
    SignupService.login(loginForm.value)
    .then(response => {
        localStorage.setItem('accessToken', response.data.access)
        localStorage.setItem('refreshToken', response.data.refresh)
        localStorage.setItem('loggedIn', true)
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
        <RouterLink :to="{name: 'Profile', params: {username: 'test', id: 10}}">Profile</RouterLink>
    </form>
</template>