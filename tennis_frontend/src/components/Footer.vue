<script setup>
const links = ['About', 'Terms', 'ATP', 'ITF']
</script>

<template>
    <v-footer class="d-flex flex-column bg-indigo-darken-4">
        <div class="d-flex w-100 align-center justify-center px-4">

        <v-btn
            v-for="link in links"
            :key="link"
            class="mx-2"
            color="white"
            rounded="xl"
            variant="text"
        >{{ link }}</v-btn>
        </div>

        <div class="px-4 py-2 text-center w-100">
            Created by <a class="text-green-darken-3" href="https://www.claire-sheridan.com" target="_blank">Claire Sheridan</a> using Vuetify
        </div>
  </v-footer>
</template>