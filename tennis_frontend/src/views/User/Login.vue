<script setup>
import BaseInput from '@/components/BaseForm/BaseInput.vue';
import SignupService from '@/services/SignupService';
import UserService from '@/services/UserService';
import { useLogin } from '@/stores/user';
import { ref } from 'vue';
import { useRouter, RouterLink } from 'vue-router';

const initialForm = {
    username: '',
    password: ''
}

const loginForm = ref(initialForm)
const store = useLogin()
const router = useRouter()
const incorrectCreds = ref(false)

const submitForm = () => {
    SignupService.login(loginForm.value)
    .then(response => {
        localStorage.setItem('accessToken', response.data.access)
        localStorage.setItem('refreshToken', response.data.refresh)
        store.setLoggedIn(true)
        UserService.username(loginForm.value.username)
        .then(response => {
            incorrectCreds.value = false
            localStorage.setItem('username', response.data[0].username)
            localStorage.setItem('userId', response.data[0].id)
            router.push({name: 'Profile', params: {username: response.data[0].username, id: response.data[0].id}})
        })
        .catch(error => console.log(error))
        loginForm.value = initialForm
    })
    .catch(error => {
        console.log(error)
        incorrectCreds.value = true
    })
}
</script>

<template>
    <div class="view-container">
        <form @submit.prevent="submitForm">
            <BaseInput type="text" placeholder="Username" v-model="loginForm.username" />
            <BaseInput type="password" placeholder="Password" v-model="loginForm.password" />
            <div class="incorrect" v-if="incorrectCreds">Incorrect username or password.</div>
            <button type="submit">Log in</button>
        </form>
        <RouterLink :to="{name: 'Signup'}" class="hover-link">Don't have an account? Sign up here!</RouterLink>
    </div>
</template>

<style scoped>
.view-container {
    border: 1px solid var(--color-border);
    margin: 0 auto;
    margin-top: 5%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: fit-content;
    height: 25rem;
    padding-left: 3rem;
    padding-right: 3rem;
    padding-top: 5rem;
    padding-bottom: 5rem;
    border-radius: 5rem;
}

form {
    display: flex;
    flex-direction: column;
}

button {
    margin: 0 auto;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    width: 50%;
    background-color: transparent;
    border: 2px solid var(--blue-border);
    padding: 0.5rem;
    color: var(--color-text);
    border-radius: 5rem;
    cursor: pointer;
}
</style>