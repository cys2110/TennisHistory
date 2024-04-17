<script setup>
import { RouterView } from 'vue-router'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue';
</script>

<template>
  <div class="viewport">
    <div class="header">
      <Header />
    </div>
    <div class="body">
      <RouterView />
    </div>
    <div class="footer">
      <Footer />
    </div>
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

.body {
  margin: 0 auto;
  width: 60%;
  margin-top: 10rem;
  flex: 1;
}

.viewport {
  display: flex;
  flex-direction: column;
  min-height: 100vh
}

.footer {
  margin: auto;
  flex-shrink: 0;
  width: 100%;
}
</style>
