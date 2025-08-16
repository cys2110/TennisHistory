<script setup lang="ts">
const { entries } = defineProps<{
  entries: EntryInterface[]
  status: APIStatusType
  tournament: TournamentInterface
}>()
const { icons } = useAppConfig()
const {
  params: { year }
} = useRoute()

const groupedEntries = computed(() => {
  const uniqueCountries = useArrayUnique(entries.map(e => e.country.id))

  const grouped = []

  for (const countryId of uniqueCountries.value) {
    const countryEntries = entries.filter(e => e.country.id === countryId)
    if (countryEntries.length) {
      grouped.push({
        country: countryEntries[0]!.country,
        entries: countryEntries
      })
    }
  }

  return grouped
})
</script>

<template>
  <u-page-columns
    v-if="entries.length || status === 'pending'"
    class="my-5"
  >
    <u-card
      v-if="entries.length"
      v-for="x in groupedEntries"
      :key="x.country.id"
      class="ring-joint"
    >
      <template #header>
        <country-link
          :country="x.country"
          :icon-only="false"
        />
      </template>

      <table class="mx-auto">
        <thead>
          <tr class="[&>th]:text-center [&>th]:px-3">
            <th colspan="2"></th>
            <th>Singles Rank</th>
            <th>Doubles Rank</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="entry in x.entries"
            :key="entry.id"
            class="[&>td]:text-center [&>td]:p-1"
          >
            <td>
              <u-badge
                :label="entry.tour"
                :color="getTourColor([entry.tour])"
              />
            </td>
            <td>
              <u-link
                class="hover-link"
                :to="{ name: 'player', params: { id: entry.id, name: kebabCase(`${entry.first_name}-${entry.last_name}`) } }"
              >
                {{ entry.first_name }} {{ entry.last_name }}
              </u-link>
            </td>
            <td>{{ entry.singles_rank }}</td>
            <td>{{ entry.doubles_rank }}</td>
          </tr>
        </tbody>
      </table>
    </u-card>

    <loading-player
      v-else
      v-for="n in 10"
      :key="n"
    />
  </u-page-columns>
  <error-message
    v-else
    :icon="icons.noPeople"
    :message="`No entries found for ${tournament.name} ${year}`"
  />
</template>
