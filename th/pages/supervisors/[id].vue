<script setup lang="ts">
definePageMeta({ name: "supervisor" })
const id = useRouteParams<string>("id")
const name = computed(() => decodeName(id.value))
useHead({ title: name.value, templateParams: { subPage: "Supervisors" } })

const year = ref<string>(new Date().getFullYear().toString())

// API calls
// Don't run the fetch immediately - wait until the year is selected
const {
  data: supervisor,
  status,
  execute
} = await useFetch<{ labels: string[]; results: EventCardType[] }>("/api/supervisor-details", {
  query: { id: name.value, year },
  immediate: false
})

// When data returns, set the year to the latest year and run the first fetch
const { data: years } = await useFetch<string[]>("/api/supervisor-years", {
  query: { id: name.value },
  onResponse: response => {
    year.value = response.response._data[response.response._data.length - 1]
    execute()
  }
})

// Breadcrumbs
const items = computed(() => [{ label: "Home", to: { name: "home" }, icon: ICONS.home }, { label: "Supervisors", to: { name: "supervisors" }, icon: ICONS.supervisor }, { label: name.value }])

// Anchor links
const links = computed(() => {
  if (supervisor.value)
    return supervisor.value.results.map(event => ({
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
          v-if="supervisor && supervisor.labels.includes('Umpire')"
          :icon="ICONS.umpire"
          label="Umpire Profile"
          :to="{ name: 'umpire', params: { id } }"
          size="xs"
        />
      </template>

      <template #toolbar>
        <year-select
          v-if="years"
          v-model="year"
          :items="years"
        />

        <div class="text-(--ui-text-muted) text-sm font-semibold">Events supervised by {{ name }}</div>

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
        v-if="supervisor && supervisor.results.length > 0"
        :events="supervisor.results"
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
        :title="`No events supervised by ${name}`"
        :status
        :error="`Error fetching events supervised by ${name}`"
      />
    </nuxt-layout>
  </div>
</template>
