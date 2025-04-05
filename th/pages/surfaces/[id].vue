<script setup lang="ts">
definePageMeta({ name: "surface" })
const toast = useToast()
const id = useRouteParams<string>("id")
const name = computed(() => decodeName(id.value))
useHead({ title: name.value, templateParams: { subPage: "Surfaces" } })

// Breadcrumbs
const items = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Surfaces", to: { name: "surfaces" }, icon: ICONS.court },
  { label: name.value, avatar: { src: `/surfaces/${name.value.replace("Indoor ", "").replace("Outdoor ", "")}.jpg`, icon: ICONS.court, class: "border border-neutral-400" } }
])

// XXX: Implement pagination
// API call
const { data: events, status } = await useFetch<EventCardType[]>("/api/surface-details", {
  query: { id: name },
  onResponseError: () => {
    toast.add({
      title: `Error fetching details for ${name.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})

// Anchor links
const links = computed(() => {
  if (events.value)
    return events.value.map(event => ({
      to: "#event-" + event.eid,
      label: event.name + " " + event.year
    }))
})
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items />
      </template>

      <!--TOC-->
      <template #right>
        <u-dropdown-menu :items="links">
          <u-button
            :icon="ICONS.toc"
            color="neutral"
            variant="link"
            size="xl"
          />
        </u-dropdown-menu>
      </template>

      <template #toolbar>
        <div class="text-(--ui-text-muted) text-sm font-semibold">Events played on {{ name }}</div>
      </template>

      <!--Event cards-->
      <event-grid
        v-if="events && events.length > 0"
        :events="events"
      />

      <error-message
        v-else
        :icon="ICONS.noInfo"
        :title="`No events played on ${name}`"
        :status
      />
    </nuxt-layout>
  </div>
</template>
