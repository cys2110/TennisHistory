<script setup lang="ts">
import { ref, type Ref } from 'vue'
import PageTitle from '@/components/layout/PageTitle.vue'
import { SearchResultKeysEnum } from '@/types/enums'

document.title = 'Search | TennisHistory'

const searchTerm: Ref<string | undefined> = ref()

const searchTypes = [
  { label: SearchResultKeysEnum.PLAYERS, value: '0', icon: ['fad', 'user'] },
  { label: SearchResultKeysEnum.TOURNAMENTS, value: '1', icon: ['fad', 'trophy'] },
  { label: SearchResultKeysEnum.COUNTRIES, value: '2', icon: ['fad', 'globe-stand'] },
  { label: SearchResultKeysEnum.VENUES, value: '3', icon: ['fad', 'location-dot'] },
  { label: SearchResultKeysEnum.SURFACES, value: '4', icon: ['fad', 'court-sport'] },
  { label: SearchResultKeysEnum.COACHES, value: '5', icon: ['fad', 'user-magnifying-glass'] },
  { label: SearchResultKeysEnum.UMPIRES, value: '6', icon: ['fad', 'whistle'] },
  { label: SearchResultKeysEnum.SUPERVISORS, value: '7', icon: ['fad', 'clipboard-user'] }
]
</script>

<template>
  <div class="py-10 px-16">
    <page-title>
      <template #heading>Search</template>
      <template #actions>
        <div class="text-slate-400">Search for players, tournaments, umpires, surfaces, supervisors, coaches and countries.</div>
      </template>
    </page-title>
  </div>
</template>

<style scoped></style>
