<script setup lang="ts">
import defaultLayout from "~/layouts/default.vue"
const route = useRoute()
const { name, eid, year } = route.params

const { data: event } = await useFetch<{ name: string }>("/api/eventName", { query: { id: eid } })

const page = computed(() => {
  return EVENT_PAGES.find(page => page.name === route.name) || null
})

const filteredLinks = computed(() => {
  return EVENT_PAGES.filter(page => page.name !== route.name)
})

if (page.value) {
  useHead({ title: `${page.value?.label} | ${event.value?.name ?? useChangeCase(name as string, "capitalCase").value} ${year}` })
}
</script>

<template>
  <default-layout>
    <u-page>
      <u-page-header
        headline="Events"
        :description="page?.label"
        :links="filteredLinks || EVENT_PAGES"
        :title="event?.name ?? useChangeCase(name as string, 'capitalCase').value"
      />
      <u-page-body>
        <slot />
      </u-page-body>
    </u-page>
  </default-layout>
</template>
