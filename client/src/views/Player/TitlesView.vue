<script setup lang="ts">
import { computed, ref, watch, type Ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import ToggleSwitch from 'primevue/toggleswitch'
import { GET_TITLES } from '@/services/PlayerService'
import { unencodeName, updateDocumentTitle } from '@/utils/functions'
import type { TitlesAndFinals } from '@/utils/types'

// Variables
const props = defineProps<{
  name: string
  id: string
}>()
const checked = ref(false)
const titles: Ref<TitlesAndFinals[] | null> = ref(null)
const finals: Ref<TitlesAndFinals[] | null> = ref(null)
const pages = [
  { title: 'Overview', name: 'player' },
  { title: 'Activity', name: 'activity' },
  { title: 'Win-Loss Index', name: 'index' },
  { title: 'Stats', name: 'stats' }
]

// Update document title
watch(() => props.name, () => updateDocumentTitle(`Titles and Finals | ${unencodeName(props.name)} | TennisHistory`), { immediate: true })

// API call
const { query, variables } = GET_TITLES(props.id)
const { result, loading, error } = useQuery(query, variables)

watch(result, (newResult) => {
  if (newResult) {
    titles.value = newResult.playertitles
    finals.value = newResult.playerfinals
  }
}, { immediate: true })

watch(error, (newError) => {
  if (newError) console.error(newError)
}, { immediate: true })
</script>

<template>
  <div v-if="titles || finals">
    <PageToolbar :pages>
      <template #start>
        <div class="flex items-center">
          <ToggleSwitch id="switch" v-model="checked" />
          <label class="ml-2 text-lg" for="switch">{{ checked ? 'Finals' : 'Titles' }}</label>
        </div>
      </template>
    </PageToolbar>
    <FinalsTable :events="checked ? finals : titles" />
  </div>
  <Loading v-else :loading>
    <template #none>No titles or finals played</template>
  </Loading>
</template>