<script setup lang="ts">
const { eid } = useRoute().params as { eid: string }
const { icons } = useAppConfig()
const viewType = ref("By Player")

// API call
const { data: entries, status } = await useFetch<EntryInterface[]>("/api/events/entries", {
  key: `event-entries-${eid}`,
  query: { id: eid },
  default: () => []
})

const consolidatedEntries = computed(() => {
  if (entries.value.length) {
    const allEntries = []
    const usedIds = new Set<string>()

    for (const entry of entries.value) {
      if (viewType.value === "By Player") {
        if (usedIds.has(entry.id)) continue

        // Find all entries with the same id
        const sameIdEntries = entries.value.filter(e => e.id === entry.id)
        const singlesEntries = sameIdEntries.filter(e => e.type === "Singles")
        const doublesEntries = sameIdEntries.filter(e => e.type === "Doubles")

        allEntries.push({
          id: entry.id,
          tour: entry.tour,
          first_name: entry.first_name,
          last_name: entry.last_name,
          country: entry.country,
          singles: {
            ...singlesEntries[0],
            draw: singlesEntries.map(e => e.draw)
          },
          doubles: {
            ...doublesEntries[0],
            draw: doublesEntries.map(e => e.draw)
          }
        })

        usedIds.add(entry.id)
      } else {
        // For team view, consolidate teams
        if (entry.type === "Singles") {
          const singlesEntries = entries.value.filter(e => e.id === entry.id && e.type === "Singles")

          allEntries.push({
            tour: entry.tour,
            type: "Singles",
            draw: singlesEntries.map(e => e.draw),
            seed: singlesEntries[0]?.seed,
            rank: singlesEntries[0]?.rank,
            q_seed: singlesEntries[0]?.q_seed,
            q_status: singlesEntries[0]?.q_status,
            status: singlesEntries[0]?.status,
            withdrawn: singlesEntries[0]?.withdrawn,
            players: [
              {
                id: entry.id,
                first_name: entry.first_name,
                last_name: entry.last_name,
                country: entry.country,
                rank: singlesEntries[0]?.rank
              }
            ]
          })
        } else {
          if (usedIds.has(entry.id)) continue

          const doublesEntries = entries.value.filter(e => e.id === entry.id && e.type === "Doubles")
          const partnerEntry = entries.value.find(e => e.id === entry.team_mate || (e.team_mate === entry.id && e.type === "Doubles"))

          allEntries.push({
            tour: entry.tour,
            type: "Doubles",
            draw: doublesEntries.map(e => e.draw),
            seed: doublesEntries[0]?.seed,
            rank: doublesEntries[0]?.rank,
            q_seed: doublesEntries[0]?.q_seed,
            q_status: doublesEntries[0]?.q_status,
            status: doublesEntries[0]?.status,
            withdrawn: doublesEntries[0]?.withdrawn,
            players: [
              {
                id: entry.id,
                first_name: entry.first_name,
                last_name: entry.last_name,
                country: entry.country,
                rank: doublesEntries[0]?.rank
              },
              partnerEntry ?
                {
                  id: partnerEntry.id,
                  first_name: partnerEntry.first_name,
                  last_name: partnerEntry.last_name,
                  country: partnerEntry.country,
                  rank: partnerEntry.rank
                }
              : null
            ].filter(Boolean)
          })

          usedIds.add(entry.id)
          if (partnerEntry) {
            usedIds.add(partnerEntry.id)
          }
        }
      }
    }

    return allEntries
  }

  return []
})
</script>

<template>
  <dashboard-subpanel
    id="entries"
    title="Entries"
    :icon="icons.player"
  >
    <template #right>
      <u-radio-group
        v-model="viewType"
        :items="['By Player', 'By Team']"
        orientation="horizontal"
      />
    </template>

    <!--@vue-expect-error-->
    <event-entries-players
      v-if="viewType === 'By Player'"
      :entries="consolidatedEntries"
      :status
    />

    <!--@vue-expect-error-->
    <event-entries-teams
      v-else
      :entries="consolidatedEntries"
      :status
    />
  </dashboard-subpanel>
</template>
