<script setup lang="ts">
definePageMeta({ name: "upcoming" })
useHead({ title: "Upcoming Tournaments" })
const toast = useToast()

const surfaces = useRouteQuery("surfaces", SURFACES)
const months = useRouteQuery("months", MONTH_NAMES)
const categories = useRouteQuery("categories", CATEGORIES)
const links = ref<{ label: string; to: string }[]>([])

// API call
const { data: events, status } = await useFetch<EventCardType[]>("/api/upcomingTournaments", {
  query: { surfaces, months, categories },
  onResponse: ({ response }) => {
    // Anchor links
    links.value = response._data.map((event: EventCardType) => ({
      label: event.name,
      to: `#${event.eid}`
    }))
  },
  onResponseError: () => {
    toast.add({
      title: "Error fetching data",
      icon: ICONS.error
    })
  }
})
</script>

<template>
  <u-page>
    <u-page-header title="Upcoming Tournaments" />

    <u-page-body>
      <!--Page toolbar (visible on smaller screens)-->
      <u-container class="lg:hidden flex flex-col justify-evenly gap-2">
        <surface-select v-model="surfaces" />
        <month-select v-model="months" />
        <category-select v-model="categories" />
      </u-container>

      <events-grid
        v-if="events && events.length > 0"
        :events
      />
      <loading-event-card v-else-if="status === 'pending'" />
      <error-message
        v-else
        :icon="ICONS['no-calendar']"
      >
        No upcoming events
      </error-message>
    </u-page-body>

    <!--Right sidebar (visible on large+ screens)-->
    <template #right>
      <u-page-aside>
        <u-container>
          <div>Filters</div>
          <month-select v-model="months" />
          <category-select v-model="categories" />
          <surface-select v-model="surfaces" />
        </u-container>
        <ClientOnly>
          <u-page-anchors
            v-if="links.length > 0"
            :links
          />
        </ClientOnly>
      </u-page-aside>
    </template>
  </u-page>
</template>
