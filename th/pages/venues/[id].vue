<script setup lang="ts">
definePageMeta({ name: "venue" })
const id = useRouteParams<string>("id")
const name = computed(() => decodeName(id.value))
useHead({ title: name.value, templateParams: { subPage: "Venues" } })

// API call
const { data: events, status } = await useFetch<EventCardType[]>("/api/venue-details", { query: { id: name.value } })

// Breadcrumbs
const items = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Venues", to: { name: "venues" }, icon: ICONS.venue },
  { label: events.value ? events.value[0].venues[0].name + ", " + events.value[0].venues[0].city : name.value, icon: `flag:${events.value?.[0].venues[0].country.alpha2}-4x3` }
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

      <template #toolbar>
        <div class="text-(--ui-text-muted) text-sm font-semibold">Events which took place in {{ events?.[0].venues[0].name ? `${events?.[0].venues[0].name}, ${events?.[0].venues[0].city}` : events?.[0].venues[0].city }}</div>

        <!--TOC-->
        <u-dropdown-menu :items="links">
          <u-button
            :icon="ICONS.toc"
            color="neutral"
            variant="link"
            size="xl"
          />
        </u-dropdown-menu>
      </template>

      <!--Event cards-->
      <event-grid
        v-if="events && events.length > 0"
        :events="events"
        class="mt-10"
      />

      <u-page-grid v-else-if="status === 'pending'">
        <event-loading-card
          v-for="_ in 10"
          :key="_"
        />
      </u-page-grid>

      <error-message
        v-else
        :title="`No events which took place in ${events?.[0].venues[0].name}`"
        :status
        :error="`Error fetching events which took place in ${events?.[0].venues[0].name}`"
      />
    </nuxt-layout>
  </div>
</template>
