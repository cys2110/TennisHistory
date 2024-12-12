<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import ToggleSwitch from 'primevue/toggleswitch'
import { GET_TITLES } from '@/services/PlayerService'
import type { TitlesAndFinals } from '@/utils/types'

// Variables
const props = defineProps<{
  name: string
  id: string
  pageNames: { title: string, name: string }[]
}>()
const checked = ref(false)
const titles: Ref<TitlesAndFinals[]> = ref([])
const finals: Ref<TitlesAndFinals[]> = ref([])
const pages = props.pageNames.filter(page => page.name !== 'titles')

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
  <div v-if="titles.length > 0 || finals.length > 0">
    <PageToolbar :pages>
      <template #start>
        <div class="flex items-center">
          <ToggleSwitch id="switch" v-model="checked" />
          <label class="ml-2 text-lg" for="switch">{{ checked ? 'Finals' : 'Titles' }}</label>
        </div>
      </template>
    </PageToolbar>
    <EventTimeline :events="checked ? finals : titles" />
  </div>
  <Loading v-else :loading>
    <template #loading>
      <LoadingTimeline />
    </template>
    <template #none>No titles or finals played</template>
  </Loading>
</template>