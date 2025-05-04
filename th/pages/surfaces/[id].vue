<script setup lang="ts">
definePageMeta({ name: "surface" })
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()

const name = computed(() => decodeName(route.params.id as string))
useHead({ title: name.value, templateParams: { subPage: "Surfaces" } })
const year = ref<string>(new Date().getFullYear().toString())

// Breadcrumbs
const breadcrumbs = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Surfaces", to: { name: "surfaces" }, icon: ICONS.court },
  {
    label: name.value,
    avatar: {
      src: `/surfaces/${name.value.replace("Indoor ", "").replace("Outdoor ", "")}.jpg`,
      icon: ICONS.court
    }
  }
])

// API calls
const { data: events, status } = await useFetch<EventCardType[]>("/api/surfaces/surface-details", {
  query: { id: name, year },
  default: () => [],
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching events on ${name.value}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

const { data: years } = await useFetch<string[]>("/api/surfaces/surface-years", {
  query: { id: name },
  onResponse: ({ response }) => (year.value = response._data[response._data.length - 1]),
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
  if (events.value)
    return events.value.map(event => ({
      to: "#event-" + event.id,
      label: event.tournament.name
    }))
  return []
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
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <ClientOnly>
          <events-grid
            v-if="viewMode === 'cards'"
            :events
            :status
            :value="name"
          />
          <events-table
            v-else
            :events
            :status
            :value="name"
          />
        </ClientOnly>
      </template>
    </u-dashboard-panel>
  </div>
</template>
