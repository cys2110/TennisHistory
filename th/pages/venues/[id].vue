<script setup lang="ts">
definePageMeta({ name: "venue" })
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const { viewMode } = useViewMode()
const name = computed(() => decodeName(route.params.id as string))

// API call
const { data: events, status } = await useFetch<EventCardType[]>("/api/venues/venue-details", {
  query: { id: name },
  default: () => [],
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

useHead({ title: events.value[0].venues[0].name, templateParams: { subPage: "Venues" } })

// Breadcrumbs
const breadcrumbs = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Venues", to: { name: "venues" }, icon: ICONS.venue },
  {
    label: events.value?.[0].venues[0].country.name ?? "Loading...",
    to: { name: "country", params: { id: events.value?.[0].venues[0].country.alpha2 } },
    icon: events.value?.[0].venues[0].country.alpha2
      ? `flag:${events.value?.[0].venues[0].country.alpha2}-4x3`
      : `flags:${events.value?.[0].venues[0].country.id}`
  },
  {
    label: events.value?.[0].venues[0].city ?? "Loading..."
  },
  {
    label: events.value?.[0].venues[0].name ?? name.value
  }
])

// Anchor links
const links = computed(() => {
  if (events.value)
    return events.value.map(event => ({
      to: "#event-" + event.id,
      label: event.tournament.name + " " + event.year
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
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar>
          <div class="text-(--ui-text-muted) text-sm font-semibold">
            Events which took place at
            {{
              events?.[0].venues[0].name
                ? `${events?.[0].venues[0].name}, ${events?.[0].venues[0].city}`
                : events?.[0].venues[0].city
            }}
          </div>
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <ClientOnly>
          <events-grid
            v-if="viewMode === 'cards'"
            :events
            :status
            :value="`${events?.[0].venues[0].name}, ${events?.[0].venues[0].city}`"
          />

          <events-table
            v-else
            :events
            :status
            :value="`${events?.[0].venues[0].name}, ${events?.[0].venues[0].city}`"
          />
        </ClientOnly>
      </template>
    </u-dashboard-panel>
  </div>
</template>
