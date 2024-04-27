<script setup>
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue';
</script>

<template>
  <v-app>
    <Header />
    <v-main>
      <RouterView :key="$route.fullPath" />
    </v-main>
    <Footer />
  </v-app>
</template>