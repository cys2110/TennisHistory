<script setup lang="ts">
definePageMeta({ name: "supervisor" })
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()

const name = computed(() => decodeName(route.params.id as string))
useHead({ title: name.value, templateParams: { subPage: "Supervisors" } })
const year = ref<string>(new Date().getFullYear().toString())

// Breadcrumbs
const breadcrumbs = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Supervisors", to: { name: "supervisors" }, icon: ICONS.supervisor },
  { label: name.value }
])

// API calls
const {
  data: supervisor,
  status,
  refresh
} = await useFetch<{ labels: string[]; results: EventCardType[] }>(
  "/api/supervisors/supervisor-details",
  {
    query: { id: name, year },
    default: () => ({ labels: [], results: [] }),
    onResponseError: ({ error }) => {
      toast.add({
        title: `Error fetching events supervised by ${name.value}`,
        description: error?.message,
        icon: appConfig.ui.icons.error,
        color: "error"
      })
      showError(error!)
    }
  }
)

const { data: years } = await useFetch<string[]>("/api/supervisors/supervisor-years", {
  query: { id: name },
  onResponse: ({ response }) => {
    year.value = response._data[response._data.length - 1]
    refresh()
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

          <template #right>
            <ClientOnly>
              <u-button
                v-if="supervisor?.labels.includes('Umpire')"
                :icon="ICONS.umpire"
                label="Umpire Profile"
                :to="{ name: 'umpire', params: { id: route.params.id } }"
                size="xs"
              />
            </ClientOnly>
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar>
          <year-select
            v-if="years"
            v-model="year"
            :items="years"
          />

          <div class="text-(--ui-text-muted) text-sm font-semibold">
            Events supervised by {{ name }}
          </div>

          <!--TOC-->
          <ClientOnly>
            <u-dropdown-menu
              v-if="viewMode === 'cards'"
              :items="links"
            >
              <u-button
                :icon="ICONS.toc"
                color="neutral"
                variant="link"
                size="xl"
              />
            </u-dropdown-menu>
          </ClientOnly>
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <ClientOnly>
          <events-grid
            v-if="viewMode === 'cards'"
            :events="supervisor?.results"
            :status
            :value="name"
          />
          <events-table
            v-else
            :events="supervisor?.results"
            :status
            :value="name"
          />
        </ClientOnly>
      </template>
    </u-dashboard-panel>
  </div>
</template>
