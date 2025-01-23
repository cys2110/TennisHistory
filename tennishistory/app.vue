<script setup lang="ts">
useHead({ titleTemplate: pageTitle => (pageTitle ? `${pageTitle} | TennisHistory` : "TennisHistory") })
</script>

<template>
  <u-app :tooltip="{ delayDuration: 100 }">
    <nuxt-loading-indicator color="repeating-linear-gradient(to right,#c4b5fd 0%,#8b5cf6 50%,#6d28d9 100%)" />
    <nuxt-layout>
      <nuxt-page />
    </nuxt-layout>
  </u-app>
</template>
