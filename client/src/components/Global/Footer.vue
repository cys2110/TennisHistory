<script setup lang="ts">
const links = [
  { name: 'ATP', url: 'https://www.atptour.com/en' },
  { name: 'ITF', url: 'https://www.itftennis.com/en/' },
  { name: 'Australian Open', url: 'https://ausopen.com/' },
  { name: 'Roland Garros', url: 'https://www.rolandgarros.com/en-us' },
  { name: 'Wimbledon', url: 'https://www.wimbledon.com/' },
  { name: 'US Open', url: 'https://www.usopen.org/' },
]
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="px-4 flex flex-col md:flex-row justify-center items-center">
      <router-link :to="{ name: 'about' }" class="hover-link text-sm text-zinc-300">About</router-link>
      <a class="hover-link mx-3 text-center text-sm text-zinc-300" target="_blank" v-for="link in links"
        :key="link.name" :href="link.url">{{
          link.name }}</a>
    </div>
    <div class="px-4 pt-2 pb-4 text-center text-zinc-300 flex items-center gap-2">
      Built by
      <a class="hover-link !text-emerald-600 text-base" href="https://www.claire-sheridan.com" target="_blank">Claire
        Sheridan</a>
      using Vue.js, TypeScript, PrimeVue and TailwindCSS
    </div>
  </div>
</template>