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
.header {
  position: fixed;
  top: 0;
  padding: 2rem;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: var(--header-background);
  z-index: 400;
}
</style>
