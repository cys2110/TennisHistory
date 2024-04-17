<script setup>
import SignupService from '@/services/SignupService';
import BaseInput from '@/components/BaseForm/BaseInput.vue';
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const initialForm = {
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: ''
}

const submitForm = ref(initialForm)
const emptyFields = ref(null)
const matchingPw = ref(null)
const validPw = ref(null)
const existingUser = ref(null)
const confirmPw = ref(null)
const router = useRouter()

const checkCompleteForm = () => {
    for (let key in submitForm.value) {
        if (submitForm.value[key] === '') {
            return true
        }
    }
    return false
}

const testPw = () => {
    const hasSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(submitForm.value.password)
    validPw.value = hasSpecialCharacter
}

const matchPw = () => {
    if (submitForm.value.password === confirmPw.value) {
        matchingPw.value = true
    } else {
        matchingPw.value = false
    }
}

const handleSubmit = () => {
    checkCompleteForm()
    if (emptyFields !== false && matchingPw && validPw) {
        SignupService.signup(submitForm.value)
        .then(response => {
            localStorage.setItem('accessToken', response.data.access)
            localStorage.setItem('refreshToken', response.data.refresh)
            localStorage.setItem('username', response.data.user.username)
            localStorage.setItem('userId', response.data.user.id)
            submitForm.value = initialForm
            router.push({name: 'Profile', params: {username: response.data.user.username, id: response.data.user.id}})
        })
        .catch(error => {
            if (error.response.data.username && error.response.data.username[0] === "A user with that username already exists.") {
                existingUser.value = true
            }
        })
    }
}
</script>

<template>
    <div class="view-container">
        <form @submit.prevent="handleSubmit">
            <BaseInput type="text" placeholder="Username" v-model="submitForm.username" />
            <BaseInput type="text" placeholder="Password" v-model="submitForm.password" @blur="testPw()" />
            <BaseInput type="text" placeholder="Confirm Password" v-model="confirmPw" @blur="matchPw()" />
            <BaseInput type="email" placeholder="Email" v-model="submitForm.email" />
            <BaseInput type="text" placeholder="First Name" v-model="submitForm.first_name" />
            <BaseInput type="text" placeholder="Last Name" v-model="submitForm.last_name" />
            <button type="submit">Submit</button>
        </form>
        <div v-if="emptyFields" class="incorrect">Please complete all fields.</div>
        <div v-if="validPw === false" class="incorrect">Password must have at least one number and one special character.</div>
        <div v-if="matchingPw === false" class="incorrect">Passwords don't match.</div>
        <div v-if="existingUser" class="incorrect">User already exists.</div>
        <RouterLink class="hover-link" :to="{name: 'Login'}">Already have an account? Log in here!</RouterLink>
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
    padding-left: 4rem;
    padding-right: 4rem;
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