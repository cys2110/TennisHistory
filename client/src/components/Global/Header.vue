<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter()

const navigate = (route: string) => {
  router.push({ name: route })
}

const menuItems = [
  { icon: 'fa-duotone fa-solid fa-house', label: 'Home', command: () => navigate('home') },
  { icon: 'fa-duotone fa-solid fa-calendar', label: 'Results Archive', command: () => navigate('archive') },
  { icon: 'fa-duotone fa-solid fa-swords', label: 'Head to Head', command: () => navigate('h2h') },
  { icon: 'fa-duotone fa-solid fa-magnifying-glass', label: 'Search', command: () => navigate('search') },
]
</script>

<template>
  <div class="flex justify-between items-center w-full h-16">
    <div class="heading text-3xl ml-5">TennisHistory</div>
    <Menubar :model="menuItems" />
  </div>
</template>

<style scoped>
.heading {
  font-family: 'Petit Formal Script', cursive;
}
</style>