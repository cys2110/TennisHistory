<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <v-main>
      <RouterView :key="$route.fullPath" />
    </v-main>
  </v-app>
</template>