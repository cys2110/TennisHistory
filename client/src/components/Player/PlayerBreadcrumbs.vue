<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { useUrlNames } from '@/utils/useUrlNames';

type Page = 'player' | 'activity' | 'titles' | 'index' | 'stats'

const route = useRoute()
const router = useRouter()
const { unencodeName } = useUrlNames()

// Variables
const { name, id } = route.params
const home = {
  icon: 'fa-duotone fa-solid fa-home',
  class: 'text-xs md:text-lg',
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
  { label: unencodeName(name as string), class: 'text-xs md:text-lg' },
  { label: pages[route.name as Page], class: 'text-xs md:text-lg' }
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