<script setup lang="ts">
const appConfig = useAppConfig()
const route = useRoute()
const toast = useToast()

const name = computed(() => decodeName(route.params.name as string))
const checked = ref(false)

// API call
const { data: entries, status } = await useFetch<CountryEntryType[]>(
  "/api/events/country-event-entries",
  {
    query: { eid: route.params.eid },
    default: () => [],
    onResponseError: ({ error }) => {
      toast.add({
        title: `Error fetching entries for ${name.value} ${route.params.year}`,
        description: error?.message,
        icon: appConfig.ui.icons.error,
        color: "error"
      })
      showError(error!)
    }
  }
)

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
      v-if="entries.length || ['pending', 'idle'].includes(status)"
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
        <div
          v-if="checked"
          class="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5"
        >
          <country-entries-cards
            v-for="entry in country.entries"
            :key="entry.id"
            :entry
          />
        </div>
        <country-entries-table
          v-else
          :entries="country.entries"
          :status
        />
      </dashboard-subpanel>
    </u-page-grid>
    <error-message
      v-else
      :icon="ICONS.noPeople"
      :title="`No entries found for ${name} ${route.params.year}`"
    />
  </dashboard-subpanel>
</template>
