<script setup lang="ts">
import defaultLayout from "./default.vue"

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
useHead({ title: currentPage.value?.label ?? "", templateParams: { subPage: name.value } })

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
const { data: drawType } = await useFetch<DrawType>("/api/events/draw-type", {
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
</script>

<template>
  <div>
    <default-layout>
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
              <event-page-buttons
                v-if="mdAndUp && drawType"
                :name
                :id
                :eid
                :year
                :draw_type="drawType"
              />
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
    </default-layout>
  </div>
</template>
