<script setup>
import Search from './Search.vue'
</script>

<template>
    <v-app-bar scroll-behavior="elevate" color="indigo-darken-4">
        <v-app-bar-title class="custom-font text-h4">Tennis History</v-app-bar-title>
        <v-btn icon="fas fa-house" href="/"></v-btn>
        <v-btn icon="far fa-calendar" href="/results-archive"></v-btn>
        <v-btn icon="fad fa-people-arrows"></v-btn>
        <v-btn rounded="xl">
            <v-icon icon="fas fa-magnifying-glass"></v-icon>
            <v-dialog activator="parent" transition="dialog-bottom-transition">
                <Search />
            </v-dialog>
        </v-btn>
    </v-app-bar>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fugaz+One&display=swap');

.custom-font {
    font-family: 'Fugaz One';
}
</style>