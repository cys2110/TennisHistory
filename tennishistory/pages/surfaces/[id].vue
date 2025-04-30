<script setup lang="ts">
definePageMeta({ name: "surface" })
const id = useRouteParams<string>("id")
const name = computed(() => decodeName(id.value))
useHead({ title: name.value, templateParams: { subPage: "Surfaces" } })
const appConfig = useAppConfig()
const toast = useToast()

const year = ref<string>(new Date().getFullYear().toString())

// Breadcrumbs
const items = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Surfaces", to: { name: "surfaces" }, icon: ICONS.court },
  {
    label: name.value,
    avatar: {
      src: `/surfaces/${name.value.replace("Indoor ", "").replace("Outdoor ", "")}.jpg`,
      icon: ICONS.court,
      class: "border border-neutral-600 dark:border-neutral-400"
    }
  }
])

// API calls
// Don't run the fetch immediately - wait until the year is selected
const {
  data: events,
  status,
  execute
} = await useFetch<EventCardType[]>("/api/surfaces/surface-details", {
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
})

// When data returns, set the year to the latest year and run the first fetch
const { data: years, refresh } = await useFetch<string[]>("/api/surfaces/surface-years", {
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

watch(
  () => id.value,
  newId => {
    if (newId) {
      refresh()
      execute()
    }
  }
)

// Anchor links
const links = computed(() => {
  if (events.value)
    return events.value.map(event => ({
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

      <template #toolbar>
        <year-select
          v-if="years"
          v-model="year"
          :items="years"
        />

        <div class="text-(--ui-text-muted) text-sm font-semibold">
          Events played on {{ name }}
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

      <u-page-grid v-if="events?.length || ['pending', 'error'].includes(status)">
        <!--Event cards-->
        <event-card
          v-if="events"
          v-for="event in events"
          :key="event.id"
          :id="`event-${event.id}`"
          :event
        />

        <!--Loading state-->
        <event-loading-card
          v-for="_ in 10"
          :key="_"
        />
      </u-page-grid>

      <!--If no events returned-->
      <error-message
        v-else
        :title="`No events played on ${name}`"
      />
    </nuxt-layout>
  </div>
</template>
