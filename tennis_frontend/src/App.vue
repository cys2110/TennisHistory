<script setup>
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue';
</script>

<template>
  <div class="header">
    <Header />
  </div>
  <div class="body">
    <RouterView />
  </div>
  <div class="footer">
    <Footer />
  </div>
</template>

<style scoped>
</style>
