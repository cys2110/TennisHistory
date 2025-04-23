<script setup lang="ts">
definePageMeta({ name: "titles-and-finals" })
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))

const route = useRoute()
const toast = useToast()

const checked = ref(false)

// API call
const { data, status, refresh } = await useFetch<TitlesAndFinalsType>("/api/titles-and-finals", {
  query: { id },
  watch: false,
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching ${name}'s titles and finals`,
      description: error?.message,
      icon: ICONS.error,
      color: "error"
    })
  }
})

watch(
  () => id.value,
  newId => {
    if (newId && route.name === "titles-and-finals") refresh()
  }
)
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
        v-if="checked && data?.finals.length"
        :events="data.finals"
      />
      <titles-stepper
        v-else-if="data?.titles.length"
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
        :status
        :error="`${name}'s titles and finals`"
      />
    </nuxt-layout>
  </div>
</template>
