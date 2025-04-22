<script setup lang="ts">
definePageMeta({ name: "titles-and-finals" })
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const checked = ref(false)

// API call
const { data, status } = await useFetch<TitlesAndFinalsType>("/api/titles-and-finals", { query: { id } })
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
        v-if="data && checked && data.finals.length > 0"
        :events="data.finals"
      />
      <titles-stepper
        v-else-if="data && data.titles.length > 0"
        :events="data.titles"
      />

      <u-page-grid
        v-else-if="status === 'pending'"
        class="2xl:grid-cols-5 mt-5 ml-5 md:ml-0"
      >
        <titles-loading-card
          v-for="_ in 5"
          :key="_"
        />
      </u-page-grid>

      <error-message
        v-else
        :icon="ICONS.noTournament"
        :title="checked ? `${name} has not played any finals` : `${name} has not won any titles`"
        :status
        :error="`Error fetching ${name}'s titles and finals`"
      />
    </nuxt-layout>
  </div>
</template>
