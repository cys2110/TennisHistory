<script setup lang="ts">
import { type Ref, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuery } from '@vue/apollo-composable'
import { GET_MATCH_BREADCRUMBS } from '@/services/MatchService'
import { useUrlNames } from '@/utils/useUrlNames'
import type { Match } from '@/utils/types'

const route = useRoute()
const router = useRouter()
const { unencodeName } = useUrlNames()
const { name, id, eid, year, mid } = route.params

// Variables
const match: Ref<Pick<Match, 'match_no' | 'round' | 'p1' | 'p2'> | null> = ref(null)

// Home breadcrumb
const home = {
  icon: 'fa-duotone fa-solid fa-house',
  class: 'text-lg',
  command: () => router.push({ name: 'home' }),
}

// Tournament breadcrumb
const breadcrumbs: Ref<{ label: string, class: string, command?: () => void }[]> = ref([
  {
    label: unencodeName(name as string),
    class: 'text-lg',
    command: () => {
      if (route.name !== 'tournament') router.push({ name: 'tournament' })
    }
  }
])

// Event breadcrumb
if (route.name !== 'tournament') {
  const breadcrumbYear = Array.isArray(year) ? year.join('') : year
  breadcrumbs.value.push({
    label: breadcrumbYear,
    class: 'text-lg',
    command: () => {
      if (route.name !== 'event' && route.name !== 'results' && route.name !== 'draw') router.push({ name: 'event' })
    }
  })
}

// API call / match breadcrumbs
if (route.name === 'match') {
  const { query, variables } = GET_MATCH_BREADCRUMBS(
    parseInt(eid as string),
    parseInt(mid as string),
  )
  const { result, loading, error } = useQuery(query, variables)
  watch(result, (newResult) => {
    if (newResult) {
      match.value = newResult.matches[0]
      breadcrumbs.value[2] = {
        label: newResult.matches[0].round.round,
        class: 'text-lg',
      }
      breadcrumbs.value[3] = {
        label: `${newResult.matches[0].p1?.player?.player.full_name} vs. ${newResult.matches[0].p2?.player?.player.full_name}`,
        class: 'text-lg',
      }
    }
  })

  watch(error, (newError) => {
    if (newError) console.error(newError)
  })
}
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