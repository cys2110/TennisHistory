<script setup lang="ts">
definePageMeta({ name: "titles-and-finals" })
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

const name = computed(() => decodeName(route.params.name as string))
const checked = ref(false)

type TitlesAndFinalsType = Record<
  "titles" | "finals",
  {
    title: string
    events: EventCardType[]
  }[]
>

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
  <div>
    <nuxt-layout name="player-layout">
      <template #toolbar>
        <u-switch
          v-model="checked"
          :checked-icon="ICONS.noTournament"
          :unchecked-icon="ICONS.tournament"
          :label="checked ? 'Finals' : 'Titles'"
          class="ml-auto"
        />
      </template>

      <titles-stepper
        v-if="checked && data.finals.length"
        :events="data.finals"
      />
      <titles-stepper
        v-else-if="data.titles.length"
        :events="data.titles"
      />

      <u-page-grid
        v-else-if="['pending', 'idle'].includes(status)"
        class="2xl:grid-cols-5 mt-5 ml-5 md:ml-0"
      >
        <event-loading-card
          v-for="_ in 5"
          :key="_"
        />
      </u-page-grid>

      <error-message
        v-else
        :icon="ICONS.noTournament"
        :title="checked ? `${name} has not played any finals` : `${name} has not won any titles`"
      />
    </nuxt-layout>
  </div>
</template>
