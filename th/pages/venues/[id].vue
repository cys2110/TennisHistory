<script setup lang="ts">
import { EventsGrid, EventsTable } from "#components"

definePageMeta({ name: "venue" })
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()
const name = computed(() => decodeName(route.params.id as string))
const venueName = ref<string>("")

const skip = ref(0)
const events = ref<EventCardType[]>([])
const dateSort = ref<"ASC" | "DESC">("ASC")

interface APIResponseType {
  count: number
  events: EventCardType[]
}

// API call
const { data, status, execute } = await useFetch<APIResponseType>("/api/venues/details", {
  query: { id: name, skip, dateSort },
  default: () => ({ count: 0, events: [] }),
  lazy: true,
  immediate: false,
  onResponse: ({ response }) => {
    events.value = [...events.value, ...(response._data.events || [])]
    venueName.value = response._data.events[0].venues[0].name
  },
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching events which took place at ${name.value}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

useHead({ title: () => venueName.value, templateParams: { subPage: "Venues" } })

// Breadcrumbs
const breadcrumbs = computed(() => {
  if (data.value.events[0]) {
    const venue = data.value?.events[0]?.venues[0]

    return [
      { label: "Home", to: { name: "home" }, icon: ICONS.home },
      { label: "Venues", to: { name: "venues" }, icon: ICONS.venue },
      {
        label: venue.country.name ?? "Loading...",
        to: { name: "country", params: { id: venue.country.alpha2 } },
        icon: venue.country.alpha2 ? `flag:${venue.country.alpha2}-4x3` : `flags:${venue.country.id}`
      },
      { label: venue.city ?? "Loading..." },
      { label: venue.name ?? name.value }
    ]
  }
  return []
})

execute()

watch([dateSort], () => {
  skip.value = 0
  events.value = []
})
</script>

<template>
  <div class="w-full">
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #leading>
            <u-dashboard-sidebar-collapse />
          </template>

          <template #title>
            <u-breadcrumb :items="breadcrumbs" />
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar>
          <div class="text-(--ui-text-muted) text-sm font-semibold mx-auto">
            Events which took place at
            {{ venueName ? `${venueName}, ${events?.[0]?.venues[0].city}` : events?.[0]?.venues[0].city }}
          </div>
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <component
          :is="viewMode === 'cards' ? EventsGrid : EventsTable"
          :key="viewMode"
          v-model="skip"
          v-model:date-sort="dateSort"
          :events
          :status
          :count="data?.count ?? 0"
          :value="
            events?.[0]?.venues[0].name ? `${events?.[0]?.venues[0].name}, ${events?.[0]?.venues[0].city}` : events?.[0]?.venues[0].city ?? name
          "
        />
      </template>
    </u-dashboard-panel>
  </div>
</template>
