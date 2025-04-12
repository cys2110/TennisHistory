<script setup lang="ts">
definePageMeta({ name: "results-archive" })
useHead({ title: "Results Archive", templateParams: { subPage: null } })

// Set select values - default year to current year and others to all
const year = useRouteQuery("year", new Date().getFullYear().toString())
const months = ref<(keyof typeof MonthsEnum)[] | undefined>()
const categories = ref<CategoryEnumType[] | undefined>()
const surfaces = ref<SurfaceEnum[] | undefined>()

// Set shortcuts for select menus
defineShortcuts({
  meta_j: () => (months.value = [MONTH_NAMES[0]]),
  meta_f: () => (months.value = [MONTH_NAMES[1]]),
  meta_m: () => (months.value = [MONTH_NAMES[2]]),
  meta_a: () => (months.value = [MONTH_NAMES[3]]),
  meta_shift_m: () => (months.value = [MONTH_NAMES[4]]),
  meta_shift_j: () => (months.value = [MONTH_NAMES[5]]),
  meta_i: () => (months.value = [MONTH_NAMES[6]]),
  meta_shift_a: () => (months.value = [MONTH_NAMES[7]]),
  meta_s: () => (months.value = [MONTH_NAMES[8]]),
  meta_o: () => (months.value = [MONTH_NAMES[9]]),
  meta_n: () => (months.value = [MONTH_NAMES[10]]),
  meta_d: () => (months.value = [MONTH_NAMES[11]]),
  meta_shift_c: () => (categories.value = categories.value && categories.value.length === CATEGORIES.length ? [] : CATEGORIES),
  meta_shift_s: () => (surfaces.value = surfaces.value && surfaces.value.length === SURFACES.length ? [] : SURFACES)
})

// API call
const { data: events, status } = await useFetch<EventCardType[]>("/api/archive-tournaments", { query: { surfaces, months, categories, year } })

// Breadcrumbs
const items = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Results Archive", icon: ICONS.event }
]

// Anchor links
const links = computed(() => {
  if (events.value) return events.value.map(event => ({ to: "#event-" + event.eid, label: event.name }))
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

      <!--Select menus-->
      <template #toolbar>
        <ClientOnly>
          <years-all-select v-model="year" />
          <month-select v-model="months" />
          <category-select v-model="categories" />
          <surface-select v-model="surfaces" />
        </ClientOnly>
      </template>

      <!--Event cards-->
      <event-grid
        v-if="events && events.length > 0"
        :events
      />
      <error-message
        v-else
        :title="`No tournaments in ${year}`"
        :icon="ICONS.noCalendar"
        :status
        :error="`Error fetching tournaments for ${year}`"
      />
    </nuxt-layout>
  </div>
</template>
