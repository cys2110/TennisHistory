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

  const countryMap = new Map<string, { country: CountryInterface; entries: CountryEntryType[] }>()

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
        :label="checked ? 'Cards' : 'Table'"
        :checked-icon="ICONS.cards"
        :unchecked-icon="ICONS.table"
      />
    </template>
    <u-page-grid
      v-if="entries && entries.length > 0"
      class="xl:grid-cols-3 2xl:grid-cols-3"
    >
      <dashboard-subpanel
        v-for="country in mappedCountries"
        :key="country.country.id"
      >
        <template #title>
          <div class="flex items-center gap-2">
            <country-link
              :country="country.country"
              class="text-xl"
            />
            {{ country.country.name }}
          </div>
        </template>
        <country-entries-grid
          v-if="checked"
          :entries="country.entries"
        />
        <country-entries-table
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
