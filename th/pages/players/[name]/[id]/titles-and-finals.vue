<script setup lang="ts">
definePageMeta({ name: "titles-and-finals" })
const toast = useToast()
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const checked = ref(false)
// API call
const { data, status } = await useFetch<TitlesAndFinalsType>("/api/titles-and-finals", {
  query: { id },
  onResponseError: () => {
    toast.add({
      title: `Error fetching ${name.value}'s titles and finals`,
      icon: ICONS.error,
      color: "error"
    })
  }
})
</script>

<template>
  <div>
    <nuxt-layout name="player-layout">
      <template #toolbar-right>
        <u-switch
          v-model="checked"
          :checked-icon="ICONS.noTournament"
          :unchecked-icon="ICONS.tournament"
          :label="checked ? 'Finals' : 'Titles'"
        />
      </template>
      <titles-stepper
        v-if="data && checked && data.finals.length > 0"
        :events="data.finals"
      />
      <titles-stepper
        v-else-if="data && data.titles.length > 0"
        :events="data.titles"
      />
      <error-message
        v-else
        :icon="ICONS.noTournament"
        :title="checked ? `${name} has not played any finals` : `${name} has not won any titles`"
        :status
      />
    </nuxt-layout>
  </div>
</template>
