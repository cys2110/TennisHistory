<script setup>
import BaseInput from '@/components/BaseForm/BaseInput.vue';
import UserService from '@/services/UserService';
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';

const store = useUserStore()

const initialForm = {
    username: '',
    password: ''
}

const loginForm = ref(initialForm)

const submitForm = () => {
    UserService.login(loginForm.value)
    .then(response => {
        store.setTokens(response.data)
        loginForm.value = initialForm
        console.log(store.tokens)
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