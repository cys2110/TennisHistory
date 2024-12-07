<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter()

const navigate = (route: string) => {
  router.push({ name: route })
}

const menuItems = [
  { icon: 'pi pi-home', label: 'Home', command: () => navigate('home') },
  { icon: 'pi pi-calendar', label: 'Results Archive', command: () => navigate('archive') },
  { icon: 'pi pi-trophy', label: 'Head to Head', command: () => navigate('h2h') },
  { icon: 'pi pi-search', label: 'Search', command: () => navigate('search') },
]
</script>

<template>
  <div class="flex justify-between items-center w-full h-16">
    <div class="heading text-3xl">TennisHistory</div>
    <Menubar :model="menuItems" />
  </div>
</template>

<style scoped>
.heading {
  font-family: 'Petit Formal Script', cursive;
}
</style>