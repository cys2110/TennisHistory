<script setup lang="ts">
useHead({ titleTemplate: pageTitle => (pageTitle ? `${pageTitle} | TennisHistory` : "TennisHistory") })
</script>

<template>
  <u-app :tooltip="{ delayDuration: 100 }">
    <!--TODO: loading indicator colors-->
    <nuxt-loading-indicator />
    <nuxt-layout>
      <nuxt-page />
    </nuxt-layout>
  </u-app>
</template>

<style>
::-webkit-scrollbar {
  display: none;
}
</style>
