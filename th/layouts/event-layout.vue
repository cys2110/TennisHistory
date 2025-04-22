<script setup lang="ts">
import defaultLayout from "./default.vue"
const id = useRouteParams<string>("id")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const year = useRouteParams<string>("year")
const eid = useRouteParams<string>("eid")
const route = useRoute()
const breakpoints = useBreakpoints(breakpointsTailwind)
const mdAndUp = breakpoints.greaterOrEqual("md")

const currentPage = computed(() => EVENT_PAGES.find(page => page.name === route.name))
useHead({ title: currentPage.value?.label ?? "", templateParams: { subPage: name.value } })

// API call
const { data: drawType } = await useFetch("/api/event-drawtype", { query: { eid } })

// Breadcrumbs
const items = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Tournaments", to: { name: "tournaments" }, icon: ICONS.tournament },
  { label: name.value, to: { name: "tournament", params: { name: paramName.value, id: id.value } } },
  { label: year.value, to: { name: "event", params: { name: paramName.value, id: id.value, year: year.value, eid: eid.value } } },
  { label: currentPage.value?.label ?? "", icon: currentPage.value?.icon, slot: "page" }
])
</script>

<template>
  <div>
    <default-layout>
      <template #title>
        <u-breadcrumb :items>
          <template #page-leading="{ item }">
            <u-icon
              v-if="item.icon === ICONS.draw"
              :name="item.icon"
              class="rotate-90 text-lg"
            />
          </template>
        </u-breadcrumb>
      </template>
      <template
        #trailing
        v-if="$slots.trailing"
      >
        <slot name="trailing" />
      </template>
      <template #right>
        <event-page-button
          v-if="mdAndUp && drawType"
          :name="paramName"
          :id
          :eid
          :year
          :draw-type="drawType"
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

      <template
        #toolbar
        v-if="$slots['toolbar']"
      >
        <slot name="toolbar" />
      </template>
      <slot />
    </default-layout>
  </div>
</template>
