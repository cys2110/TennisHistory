<script setup lang="ts">
definePageMeta({ name: "supervisor" })
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

const name = computed(() => decodeName(route.params.id as string))
useHead({ title: name.value, templateParams: { subPage: "Supervisors" } })
const year = ref<string>(new Date().getFullYear().toString())

// Breadcrumbs
const items = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Supervisors", to: { name: "supervisors" }, icon: ICONS.supervisor },
  { label: name.value }
])

// API calls
// Don't run the fetch immediately - wait until the year is selected
const {
  data: supervisor,
  status,
  execute
} = await useFetch<{ labels: string[]; results: EventCardType[] }>(
  "/api/supervisors/supervisor-details",
  {
    query: { id: name.value, year },
    immediate: false,
    onResponseError: ({ error }) => {
      toast.add({
        title: `Error fetching ${name.value}'s events`,
        description: error?.message,
        icon: appConfig.ui.icons.error,
        color: "error"
      })
      showError(error!)
    }
  }
)

// When data returns, set the year to the latest year and run the first fetch
const { data: years } = await useFetch<string[]>("/api/supervisors/supervisor-years", {
  query: { id: name.value },
  onResponse: ({ response }) => {
    year.value = response._data[response._data.length - 1]
    execute()
  },
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching ${name.value} years`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

// Anchor links
const links = computed(() => {
  if (supervisor.value)
    return supervisor.value.results.map(event => ({
      to: "#event-" + event.id,
      label: event.tournament.name
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
          v-if="supervisor?.labels.includes('Umpire')"
          :icon="ICONS.umpire"
          label="Umpire Profile"
          :to="{ name: 'umpire', params: { id: route.params.id } }"
          size="xs"
        />
      </template>

      <template #toolbar>
        <year-select
          v-if="years"
          v-model="year"
          :items="years"
        />

        <div class="text-(--ui-text-muted) text-sm font-semibold">
          Events supervised by {{ name }}
        </div>

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

      <u-page-grid v-if="supervisor?.results.length || ['pending', 'idle'].includes(status)">
        <event-card
          v-if="supervisor"
          v-for="event in supervisor?.results"
          :key="event.id"
          :id="`event-${event.id}`"
          :event
        />

        <event-loading-card
          v-else
          v-for="_ in 10"
          :key="_"
        />
      </u-page-grid>

      <error-message
        v-else
        :title="`No events found for ${name}`"
        :icon="ICONS.noSupervisor"
      />
    </nuxt-layout>
  </div>
</template>
