<script setup lang="ts">
definePageMeta({ name: "venue" })
const toast = useToast()
const id = useRouteParams<string>("id")
const name = computed(() => decodeName(id.value))
useHead({ title: name.value, templateParams: { subPage: "Venues" } })

// API call
const { data: events, status } = await useFetch<EventCardType[]>("/api/venue-details", {
  query: { id: name.value },
  onResponseError: () => {
    toast.add({
      title: `Error fetching ${name.value}'s details`,
      icon: ICONS.error,
      color: "error"
    })
  }
})

// Breadcrumbs
const items = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Venues", to: { name: "venues" }, icon: ICONS.venue },
  { label: events.value ? events.value[0].locations[0].name + ", " + events.value[0].locations[0].city : name.value, icon: `flag:${events.value?.[0].locations[0].country.alpha2}-4x3` }
])

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
        <div class="text-(--ui-text-muted) text-sm font-semibold">Events which took place in {{ events?.[0].locations[0].name }}, {{ events?.[0].locations[0].city }}</div>
      </template>

      <!--Event cards-->
      <event-grid
        v-if="events && events.length > 0"
        :events="events"
        class="mt-10"
      />

      <error-message
        v-else
        :icon="ICONS.noSupervisor"
        :title="`No events which took place in ${events?.[0].locations[0].name}`"
        :status
      />
    </nuxt-layout>
  </div>
</template>
