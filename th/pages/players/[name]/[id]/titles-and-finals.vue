<script setup lang="ts">
import { TitlesStepper, TitlesTable } from "#components"

definePageMeta({ name: "titles-and-finals" })
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()

const name = computed(() => decodeName(route.params.name as string))
const checked = ref(false)

// API call
const { data, status } = await useFetch<TitlesAndFinalsType>("/api/players/titles-and-finals", {
  query: { id: route.params.id },
  default: () => ({ titles: [], finals: [] }),
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching ${name}'s titles and finals`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})
</script>

<template>
  <player-wrapper>
    <template #toolbar>
      <u-switch
        v-model="checked"
        :checked-icon="ICONS.noTournament"
        :unchecked-icon="ICONS.tournament"
        :label="checked ? 'Finals' : 'Titles'"
        class="ml-auto"
      />
    </template>

    <component
      :is="viewMode === 'cards' ? TitlesStepper : TitlesTable"
      :key="`${viewMode}-${checked}`"
      :events="checked ? data.finals : data.titles"
      :status
      :checked
    />
  </player-wrapper>
</template>
