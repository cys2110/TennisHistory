<script setup lang="ts">
definePageMeta({ name: "venue" })
const id = useRouteParams<string>("id")
const name = computed(() => decodeName(id.value))
useHead({ title: name.value, templateParams: { subPage: "Venues" } })

const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

// API call
const {
  data: events,
  status,
  refresh
} = await useFetch<EventCardType[]>("/api/venues/venue-details", {
  query: { id: name.value },
  watch: false,
  onResponseError: ({ error }) => {
    toast.add({
      title: `Error fetching events which took place in ${name.value}`,
      description: error?.message,
      icon: appConfig.ui.icons.error,
      color: "error"
    })
    showError(error!)
  }
})

watch(
  () => id.value,
  newId => {
    if (newId && route.name === "venue") refresh()
  },
  { immediate: true }
)

// Breadcrumbs
const items = computed(() => [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Venues", to: { name: "venues" }, icon: ICONS.venue },
  {
    label: events.value
      ? events.value[0].venues[0].name + ", " + events.value[0].venues[0].city
      : name.value,
    icon: `flag:${events.value?.[0].venues[0].country.alpha2}-4x3`
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
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items />
      </template>

      <template #toolbar>
        <div class="text-(--ui-text-muted) text-sm font-semibold"
          >Events which took place in
          {{
            events?.[0].venues[0].name
              ? `${events?.[0].venues[0].name}, ${events?.[0].venues[0].city}`
              : events?.[0].venues[0].city
          }}</div
        >

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

      <u-page-grid v-if="events?.length || ['pending', 'idle'].includes(status)">
        <!--Event cards-->
        <event-card
          v-if="events"
          v-for="event in events"
          :key="event.id"
          :id="`event-${event.id}`"
          :event
        />

        <event-loading-card
          v-else
          v-for="_ in 10"
          :key="_"
        />
      </u-page-grid>

      <error-message
        v-else
        :title="`No events which took place in ${events?.[0].venues[0].name ?? name}`"
      />
    </nuxt-layout>
  </div>
</template>
