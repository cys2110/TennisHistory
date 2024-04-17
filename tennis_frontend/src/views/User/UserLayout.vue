<script setup>
import UserService from '@/services/UserService';
import { onMounted, ref } from 'vue';
import { RouterView } from 'vue-router';

const props = defineProps(['id', 'username'])
const user = ref(null)

onMounted(() => {
    UserService.login(props.id)
    .then(response => {
        user.value = response.data
        console.log(user.value)
    })
    .catch(error => console.log(error))
})
</script>

<template>
    <div class="user-layout-container" v-if="user">
        <h1>Welcome back, {{ user.first_name }}</h1>
        <RouterView :user="user" />
    </div>
</template>