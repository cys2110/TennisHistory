<script setup lang="ts">
defineProps<{ breadcrumbs: BreadcrumbType[] }>()
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

const name = computed(() => decodeName(route.params.id as string))
const year = ref<string>(new Date().getFullYear().toString())

// API calls
const {
  data: umpire,
  status,
  refresh
} = await useFetch<{ labels: string[]; results: UmpireDetailsType[] }>(
  "/api/umpires/umpire-details",
  {
    query: { id: name, year },
    onResponseError: ({ error }) => {
      toast.add({
        title: `Error fetching matches umpired by ${name.value}`,
        description: error?.message,
        icon: appConfig.ui.icons.error,
        color: "error"
      })
      showError(error!)
    }
  }
)

const { data: years } = await useFetch<string[]>("/api/umpires/umpire-years", {
  query: { id: name },
  onResponse: ({ response }) => {
    year.value = response._data[response._data.length - 1]
    refresh()
  },
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching ${name.value}'s years`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

// Anchor links
const links = computed(() => {
  if (umpire.value)
    return umpire.value.results.map(event => ({
      to: "#event-" + event.id,
      label: event.tournament.name
    }))
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
                v-if="umpire?.labels.includes('Umpire')"
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
            class="w-fit"
          />

          <div class="text-(--ui-text-muted) text-sm font-semibold text-center">
            Matches umpired by {{ name }}
          </div>

          <!--TOC-->
          <ClientOnly>
            <u-dropdown-menu :items="links">
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

      <template #body></template>
    </u-dashboard-panel>
  </div>
</template>
