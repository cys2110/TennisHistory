<script setup lang="ts">
definePageMeta({ name: "upcoming", layout: false })
useHead({ title: "Upcoming Tournaments", templateParams: { subPage: null } })
const toast = useToast()

// Set select values - default to all
const months = ref<(keyof typeof MonthsEnum)[] | undefined>()
const categories = ref<BaseCategoryEnumType[] | undefined>()
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
  meta_shift_c: () => (categories.value = categories.value && categories.value.length === BASE_CATEGORIES.length ? [] : BASE_CATEGORIES),
  meta_shift_s: () => (surfaces.value = surfaces.value && surfaces.value.length === SURFACES.length ? [] : SURFACES)
})

// API call
const { data: events } = await useFetch<ArchiveEventType[]>("/api/upcoming-tournaments", {
  query: { surfaces, months, categories },
  onResponseError: () =>
    toast.add({
      title: "Error fetching upcoming tournaments",
      icon: ICONS.error,
      color: "error"
    })
})

// Anchor links
const links = computed(() => {
  if (events.value) {
    return events.value.map(event => ({
      to: `#event-${event.eid}`,
      label: event.name
    }))
  }
})
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #leading-icon>
        <u-icon
          :name="ICONS['calendar-event']"
          class="text-xl"
        />
      </template>
      <template #title>Upcoming Tournaments</template>
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
        <month-select v-model="months" />
        <base-category-select v-model="categories" />
        <surface-select v-model="surfaces" />
      </template>

      <!--Event cards-->
      <events-grid
        v-if="events && events.length > 0"
        :events
      />
      <error-message
        v-else
        :icon="ICONS['no-calendar']"
        title="No upcoming tournaments"
      />
    </nuxt-layout>
  </div>
</template>
