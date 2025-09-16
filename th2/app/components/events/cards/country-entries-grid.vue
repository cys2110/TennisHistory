<script setup lang="ts">
const { entries, status } = defineProps<{ entries: CountryEntryType[]; status: APIStatusType }>()
const appConfig = useAppConfig()
const route = useRoute()
const name = computed(() => decodeName(route.params.name as string))

const mappedCountries = computed(() => {
  if (!entries.length) return []

  const countryMap = new Map<string, { country: CountryInterface; entries: CountryEntryType[] }>()

  for (const entry of entries) {
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
  <u-page-grid
    v-if="entries.length || ['pending', 'idle'].includes(status)"
    class="lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2"
  >
    <dashboard-subpanel
      v-for="country in mappedCountries"
      :key="country.country.id"
    >
      <template #title>
        <div class="flex items-center gap-2">
          <base-link
            type="country"
            :country="country.country"
            class="text-xl"
          />
          <base-link
            type="country"
            :id="country.country.id"
            >{{ country.country.name }}</base-link
          >
        </div>
      </template>
      <div class="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-5 mt-5">
        <entry-card
          v-for="entry in country.entries"
          :key="entry.id"
          :entry="entry as any"
        />
      </div>
    </dashboard-subpanel>
  </u-page-grid>
  <error-message
    v-else
    :icon="ICONS.noPeople"
    :message="`No entries found for ${name} ${route.params.year}`"
  />
</template>
