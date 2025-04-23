<script setup lang="ts">
definePageMeta({ name: "surface" })
const id = useRouteParams<string>("id")
const name = computed(() => decodeName(id.value))
useHead({ title: name.value, templateParams: { subPage: "Surfaces" } })

const year = ref<string>(new Date().getFullYear().toString())

// API calls
// Don't run the fetch immediately - wait until the year is selected
const {
  data: events,
  status,
  execute
} = await useFetch<EventCardType[]>("/api/surface-details", {
  query: { id: name.value, year },
  immediate: false
})

// When data returns, set the year to the latest year and run the first fetch
const { data: years } = await useFetch<string[]>("/api/surface-years", {
  query: { id: name.value },
  onResponse: response => {
    year.value = response.response._data[response.response._data.length - 1]
    execute()
  }
})

// Breadcrumbs
const items = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Surfaces", to: { name: "surfaces" }, icon: ICONS.court },
  { label: name.value, avatar: { src: `/surfaces/${name.value.replace("Indoor ", "").replace("Outdoor ", "")}.jpg`, icon: ICONS.court, class: "border border-neutral-400" } }
])

// Anchor links
const links = computed(() => {
  if (events.value)
    return events.value.map(event => ({
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

      <template #toolbar>
        <year-select
          v-if="years"
          v-model="year"
          :items="years"
        />

        <div class="text-(--ui-text-muted) text-sm font-semibold">Events played on {{ name }}</div>

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
      <event-grid
        v-if="events && events.length > 0"
        :events="events"
      />

      <u-page-grid v-else-if="status === 'pending'">
        <event-loading-card
          v-for="_ in 10"
          :key="_"
        />
      </u-page-grid>

      <error-message
        v-else
        :icon="ICONS.noSupervisor"
        :title="`No events played on ${name}`"
        :status
        :error="`Error fetching events played on ${name}`"
      />
    </nuxt-layout>
  </div>
</template>
