<script setup lang="ts">
import type { BreadcrumbItem } from "@nuxt/ui"

const {
  ui: { icons }
} = useAppConfig()
const { name: routeName } = useRoute()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: useSSRWidth() })
const mdAndUp = breakpoints.greaterOrEqual("md")

const breadcrumbs = computed<BreadcrumbItem[]>(() => {
  const crumbs: BreadcrumbItem[] = [{ label: "Home", icon: ICONS.home, to: { name: "home" } }]

  switch (routeName) {
    case "about":
      return [...crumbs, { label: "About", icon: icons.info, to: { name: "about" } }]
    default:
      return crumbs
  }
})

const pageTitle = computed(() => {
  switch (routeName) {
    default:
      return capitalCase(routeName)
  }
})
</script>

<template>
  <u-breadcrumb
    v-if="mdAndUp"
    :items="breadcrumbs"
  />

  <div
    v-else
    class="font-semibold text-muted text-wrap text-sm"
  >
    {{ pageTitle }}
  </div>
</template>
