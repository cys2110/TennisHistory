<script setup lang="ts">
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndUp = breakpoints.greaterOrEqual("md")

const currentPage = computed(() => EVENT_PAGES.find(page => page.name === route.name))
const id = computed(() => route.params.id as string)
const year = computed(() => route.params.year as string)
const eid = computed(() => route.params.eid as string)
const name = computed(() => decodeName(route.params.name as string))
useHead({ title: () => currentPage.value?.label ?? "", templateParams: { subPage: () => name.value } })

// Breadcrumbs
const breadcrumbs = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Tournaments", to: { name: "tournaments" }, icon: ICONS.tournament },
  {
    label: name.value,
    to: { name: "tournament", params: { name: route.params.name, id: route.params.id } }
  },
  {
    label: route.params.year as string,
    to: {
      name: "event",
      params: {
        name: route.params.name,
        id: route.params.id,
        year: route.params.year,
        eid: route.params.eid
      }
    }
  },
  { label: currentPage.value?.label ?? "", icon: currentPage.value?.icon, slot: "page" }
])

// API call
const { data: event } = await useFetch<{ draw_type: DrawType; atp_link: string | null; wiki_link: string | null }>("/api/events/draw-type", {
  query: { id: route.params.eid },
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching draw type for ${name.value} ${route.params.year}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

const additionalButtons = computed(() => {
  if (event.value) {
    return [
      event.value.atp_link && {
        label: "ATP Profile",
        to: event.value.atp_link
      },
      event.value.wiki_link && {
        label: "Wikipedia",
        to: event.value.wiki_link
      }
    ].filter(Boolean) as { label: string; icon?: string; to: string }[]
  }
  return []
})
</script>

<template>
  <div>
    <u-dashboard-panel>
      <template #header>
        <u-dashboard-navbar>
          <template #leading>
            <u-dashboard-sidebar-collapse />
          </template>

          <template #title>
            <u-breadcrumb :items="breadcrumbs">
              <template #page-leading="{ item }">
                <u-icon
                  v-if="item.icon === ICONS.draw"
                  :name="item.icon"
                  class="rotate-90 text-lg"
                />
              </template>
            </u-breadcrumb>
          </template>

          <template #right>
            <div
              v-if="mdAndUp && event"
              class="flex items-center gap-2"
            >
              <event-page-buttons
                :name
                :id
                :eid
                :year
                :draw_type="event.draw_type"
              />
              <u-button
                v-for="button in additionalButtons"
                :key="button.label"
                :icon="button.icon ?? appConfig.ui.icons.external"
                :label="button.label"
                :to="button.to"
                size="xs"
                color="primary"
              />
            </div>
            <u-dropdown-menu
              v-else
              :items="EVENT_PAGES"
            >
              <u-button
                :icon="ICONS.layers"
                color="neutral"
                variant="link"
                size="xl"
              />
            </u-dropdown-menu>
          </template>
        </u-dashboard-navbar>

        <u-dashboard-toolbar v-if="$slots.toolbar">
          <slot name="toolbar" />
        </u-dashboard-toolbar>
      </template>

      <template #body>
        <slot />
      </template>
    </u-dashboard-panel>
  </div>
</template>
