<script setup lang="ts">
import { type Ref, ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_PLAYER } from '@/services/PlayerService'
import { gladiator, headshot, unencodeName, updateDocumentTitle } from '@/utils/functions'
import type { Player } from '@/utils/types'
import { useGlobalBreakpoints } from '@/utils/useGlobalBreakpoints'

// [TODO: FIGURE OUT MAJOR RESULTS APICALL]

// Variables
const props = defineProps<{
  name: string
  id: string
}>()
const player: Ref<Player | null> = ref(null)

const { isBreakpointOrUp, isBreakpoint } = useGlobalBreakpoints()

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
  <PageToolbar :pages />
  <div v-if="player && isBreakpoint('sm')" class="flex justify-center mb-10">
    <Avatar style="border: 1px solid #d4d4d8" shape="circle" :image="headshot(player.id)" size="xlarge" />
  </div>
  <div v-if="player" class="grid grid-cols-5 grid-flow-col">
    <div v-if="isBreakpointOrUp('md')">
      <Image :alt="player.full_name" :src="player.gladiator ? gladiator(player.id) : headshot(player.id)"
        class="rounded-full" />
    </div>
    <div class="col-span-5 md:col-span-4">
      <PlayerDetails :player />
    </div>
  </div>

  <!--[TODO: INSERT MAJOR RESULTS TABLE]-->
  <Loading v-else :loading>
    <template #none>No data available</template>
  </Loading>
</template>