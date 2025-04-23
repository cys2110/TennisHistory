<script setup lang="ts">
definePageMeta({ name: "umpire" })
const id = useRouteParams<string>("id")
const name = computed(() => decodeName(id.value))
useHead({ title: name.value, templateParams: { subPage: "Umpires" } })

const year = ref<string>(new Date().getFullYear().toString())

// API calls
// Don't run the fetch immediately - wait until the year is selected
const {
  data: umpire,
  status,
  execute
} = await useFetch<{ labels: string[]; results: UmpireDetailsType[] }>("/api/umpire-details", {
  query: { id: name.value, year },
  immediate: false,
  onResponse: response => console.log(response.response._data)
})

// When data returns, set the year to the latest year and run the first fetch
const { data: years } = await useFetch<string[]>("/api/umpire-years", {
  query: { id: name.value },
  onResponse: response => {
    year.value = response.response._data[response.response._data.length - 1]
    execute()
  }
})

// Breadcrumbs
const items = computed(() => [{ label: "Home", to: { name: "home" }, icon: ICONS.home }, { label: "Umpires", to: { name: "umpires" }, icon: ICONS.umpire }, { label: name.value }])

// Anchor links
const links = computed(() => {
  if (umpire.value)
    return umpire.value.results.map(event => ({
      to: "#event-" + event.eid,
      label: event.name + " " + event.year
    }))
})
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items />
      </template>

      <template #right>
        <u-button
          v-if="umpire && umpire.labels.includes('Supervisor')"
          :icon="ICONS.supervisor"
          label="Supervisor Profile"
          :to="{ name: 'supervisor', params: { id } }"
          size="xs"
        />
      </template>

      <template #toolbar>
        <year-select
          v-if="years"
          v-model="year"
          :items="years"
        />

        <div class="text-(--ui-text-muted) text-sm font-semibold">Matches umpired by {{ name }}</div>

        <!--TOC-->
        <u-dropdown-menu :items="links">
          <u-button
            :icon="ICONS.toc"
            color="neutral"
            variant="link"
            size="xl"
          />
        </u-dropdown-menu>
      </template>

      <!--Event cards-->
      <u-page-columns
        v-if="umpire"
        class="xl:columns-4 2xl:columns-4"
      >
        <umpire-event-card
          v-for="event in umpire.results"
          :key="event.tid"
          :id="`event-${event.eid}`"
          :event
        />
      </u-page-columns>

      <u-page-columns
        v-else-if="status === 'pending'"
        class="xl:columns-4 2xl:columns-4"
      >
        <umpire-event-loading-card
          v-for="_ in 10"
          :key="_"
        />
      </u-page-columns>

      <error-message
        v-else
        :title="`No matches umpired by ${name}`"
        :status
        :error="`Error fetching matches umpired by ${name}`"
      />
    </nuxt-layout>
  </div>
</template>
