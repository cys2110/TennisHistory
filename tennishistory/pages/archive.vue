<script setup lang="ts">
definePageMeta({ name: "archive" })
useHead({ title: "Results Archive" })
const toast = useToast()

const surfaces = useRouteQuery("surfaces", SURFACES)
const months = useRouteQuery("months", MONTH_NAMES)
const categories = useRouteQuery("categories", CATEGORIES)
const years = useRouteQuery("years", [new Date().getFullYear().toString()])
const links = ref<{ label: string; to: string }[]>([])
const yearsArray = Array.from({ length: new Date().getFullYear() - 1968 + 1 }, (_, index) => (1968 + index).toString())

const { data: events, status } = await useFetch<EventCardType[]>("/api/archiveTournaments", {
  query: { surfaces, months, categories, years },
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
    <u-page-header title="Results Archive" />

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
          <year-select
            v-model="years"
            :items="yearsArray"
          />
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
