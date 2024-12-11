<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { unencodeName } from '@/utils/functions'
import { ref } from 'vue';

type Page = 'player' | 'activity' | 'titles' | 'index' | 'stats'

const route = useRoute()
const router = useRouter()

// Variables
const { name, id } = route.params
const home = {
  icon: 'pi pi-home',
  class: 'text-lg',
  command: () => router.push({ name: 'home' })
}

const pages = {
  player: 'Details',
  activity: 'Activity',
  titles: 'Titles and Finals',
  index: 'Win-Loss Index',
  stats: 'Stats'
}

const breadcrumbs = ref([
  {
    label: unencodeName(name as string),
    class: 'text-lg'
  },
  {
    label: pages[route.name as Page],
    class: 'text-lg'
  }
])
</script>

<template>
  <Breadcrumb :home="home" :model="breadcrumbs">
    <template #separator>/</template>
  </Breadcrumb>
</template>

<style scoped>
:deep(.p-breadcrumb-item:last-child .p-breadcrumb-item-label) {
  font-weight: bold !important;
}
</style>