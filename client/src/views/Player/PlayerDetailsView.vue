<script setup lang="ts">
import { type Ref, ref, watch } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_PLAYER } from '@/services/PlayerService'
import type { Player } from '@/utils/types'
import { useGlobalBreakpoints } from '@/utils/useGlobalBreakpoints'
import { useImages } from '@/utils/useImages'

// TODO: Skeleton loader
// TODO: FIGURE OUT MAJOR RESULTS APICALL

const { isBreakpointOrUp, isBreakpoint } = useGlobalBreakpoints()
const { gladiator, headshot } = useImages()

// Variables
const props = defineProps<{
  name: string
  id: string
  pageNames: { title: string; name: string }[]
}>()
const player: Ref<Player | null> = ref(null)
const pages = props.pageNames.filter(page => page.name !== 'player')

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
    <Avatar style="border: 1px solid var(--p-zinc-400)" shape="circle" :image="headshot(player.id)" size="xlarge" />
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