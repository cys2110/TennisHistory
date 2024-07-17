<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from '@/components/Header/Header.vue'
import Footer from '@/components/Footer/Footer.vue'
</script>

<template>
  <v-app>
    <div class="wrapper">
      <Header />
      <div class="main">
        <v-main>
          <RouterView :key="$route.fullPath" />
        </v-main>
      </div>
      <Footer />
    </div>
  </v-app>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1
}
</style>