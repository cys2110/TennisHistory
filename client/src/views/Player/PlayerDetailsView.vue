<script setup lang="ts">
import { type Ref, ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_PLAYER } from '@/services/PlayerService'
import { gladiator, headshot, unencodeName, updateDocumentTitle } from '@/utils/functions'
import type { Player } from '@/utils/types'

// [TODO: FIGURE OUT MAJOR RESULTS APICALL]

// Variables
const props = defineProps<{
  name: string
  id: string
}>()
const player: Ref<Player | null> = ref(null)

// Menubar
const menuItems: Ref<{ route: string; label: string }[]> = ref([])
const menuOptions = { itemColor: '{cyan.500}', gap: '1rem' }
const pages = [
  { title: 'Activity', name: 'activity' },
  { title: 'Titles and Finals', name: 'titles' },
  { title: 'Win-Loss Index', name: 'index' },
  { title: 'Stats', name: 'stats' }
]

// Update document title
watch(() => props.name, () => updateDocumentTitle(`${unencodeName(props.name)} | TennisHistory`), { immediate: true })

// API call
const { query, variables } = GET_PLAYER(props.id)
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
  if (newResult) player.value = newResult.players[0]
})
watch(error, (newError) => {
  if (newError) console.error(newError)
})
</script>

<template>
  <Menubar :model="menuItems" class="mb-5" :dt="menuOptions">
    <template #end>
      <div class="flex items-center">
        <Button v-for="page in pages" :key="page.title" as="router-link" :label="page.title" size="small" rounded
          class="mx-2" raised :to="{ name: page.name }" />
      </div>
    </template>
  </Menubar>
  <div v-if="player" class="grid grid-cols-5 grid-flow-col">
    <div>
      <Image :alt="player.full_name" :src="player.gladiator ? gladiator(player.id) : headshot(player.id)"
        class="rounded-full" />
    </div>
    <div class="col-span-4">
      <PlayerDetails :player />
    </div>
  </div>

  <!--[TODO: INSERT MAJOR RESULTS TABLE]-->
  <Loading v-else :loading>
    <template #none>No data available</template>
  </Loading>
</template>