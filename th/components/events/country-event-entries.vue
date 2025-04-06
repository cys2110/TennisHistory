<script setup lang="ts">
const eid = useRouteParams<string>("eid")
const year = useRouteParams<string>("year")
const paramName = useRouteParams<string>("name")
const name = computed(() => decodeName(paramName.value))
const checked = ref(false)

// API call
const { data: entries, status } = await useFetch<CountryEntryType[]>("/api/country-event-entries", { query: { eid } })

const mappedCountries = computed(() => {
  if (!entries.value) return []

  const countryMap = new Map<string, { country: Country; entries: CountryEntryType[] }>()

  for (const entry of entries.value) {
    const { id } = entry.country

    if (!countryMap.has(id)) {
      countryMap.set(id, {
        country: entry.country,
        entries: [entry]
      })
    } else {
      countryMap.get(id)!.entries.push(entry)
    }
  }

  return [...countryMap.values()]
})
</script>

<template>
  <dashboard-subpanel
    title="Entries"
    :icon="ICONS.player"
  >
    <template #right>
      <u-switch
        v-model="checked"
        :label="checked ? 'Table view' : 'Card view'"
        :checked-icon="ICONS.table"
        :unchecked-icon="ICONS.cards"
      />
    </template>
    <u-page-grid
      v-if="entries && entries.length > 0"
      class="xl:grid-cols-3 2xl:grid-cols-3"
    >
      <dashboard-subpanel
        v-for="country in mappedCountries"
        :key="country.country.id"
        :title="country.country.name"
        :icon="`flag:${country.country.alpha2}-4x3`"
      >
        <country-entries-table
          v-if="checked"
          :entries="country.entries"
        />
        <country-entries-grid
          v-else
          :entries="country.entries"
        />
      </dashboard-subpanel>
    </u-page-grid>
    <error-message
      v-else
      :icon="ICONS.noPeople"
      :title="`No entries found for ${name} ${year}`"
      :status
      :error="`Error fetching entries for ${name} ${year}`"
    />
  </dashboard-subpanel>
</template>
