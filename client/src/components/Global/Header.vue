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
  <div class="bg-violet-800 sticky top-0 z-50 w-full flex items-center justify-between md:px-2 lg:px-10 py-3">
    <div class="heading text-3xl ml-5 text-zinc-300">TennisHistory
    </div>
    <menubar :model="menuItems" />
  </div>
</template>

<style scoped>
.heading {
  font-family: 'Petit Formal Script', cursive;
}
</style>