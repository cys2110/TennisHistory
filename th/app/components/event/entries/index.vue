<script setup lang="ts">
import { EventEntriesGrid, EventEntriesTable } from "#components"

const { viewMode } = useViewMode()
const {
  params: { eid }
} = useRoute()
const { icons } = useAppConfig()
const viewType = ref(true)
const tours = inject<TourType[]>("tours", [])
const tour = ref<TourType[]>(["ATP", "WTA"])
const drawType = ref<DrawType[]>(["Main", "Qualifying"])
const matchType = ref<MatchType[]>(["Singles", "Doubles"])

type APIResponseType = {
  tournament: string
  entries: AllEntriesInterface[]
}

// API call
const { data, status } = await useFetch<APIResponseType>("/api/events/entries", {
  query: { id: eid }
})

const sortedEntries = computed(() => {
  if (data.value?.entries.length) {
    const allEntries: ConsolidatedEntryType[] = []
    const usedIds = new Set<string>()
    const usedDoublesIds = new Set<string>()
    for (const entry of data.value.entries) {
      // Find all entries with the same id
      const sameIdEntries = data.value.entries.filter(e => e.id === entry.id)
      const singlesMainEntry = sameIdEntries.find(e => e.type === "Singles" && e.draw === "Main")
      const singlesQualEntry = sameIdEntries.find(e => e.type === "Singles" && e.draw === "Qualifying")
      const doublesMainEntry = sameIdEntries.find(e => e.type === "Doubles" && e.draw === "Main")
      const doublesQualEntry = sameIdEntries.find(e => e.type === "Doubles" && e.draw === "Qualifying")

      if (viewType.value) {
        // Consolidate singles players
        if (entry.type === "Singles") {
          if (usedIds.has(entry.id)) continue

          allEntries.push({
            type: sameIdEntries.filter(e => e.type === "Singles").map(e => `${e.draw} ${e.type}`),
            tour: entry.tour,
            ...(singlesMainEntry?.status && { singles_status: singlesMainEntry.status }),
            ...(singlesQualEntry?.q_status && { singles_q_status: singlesQualEntry.q_status }),
            ...(singlesMainEntry?.seed && { singles_seed: singlesMainEntry.seed }),
            ...(singlesQualEntry?.q_seed && { singles_q_seed: singlesQualEntry.q_seed }),
            singles_withdrawn: singlesMainEntry?.withdrawn || singlesQualEntry?.withdrawn,
            players: [
              {
                id: entry.id,
                first_name: entry.first_name,
                last_name: entry.last_name,
                country: entry.country,
                ...((singlesMainEntry?.rank || singlesQualEntry?.rank) && { singles_rank: singlesMainEntry?.rank ?? singlesQualEntry?.rank })
              }
            ]
          })
          usedIds.add(entry.id)
        } else {
          if (usedDoublesIds.has(entry.id)) continue
          const partnerEntry = data.value.entries.find(e => e.id === entry.team_mate || e.team_mate === entry.id)!

          allEntries.push({
            type: sameIdEntries.filter(e => e.type === "Doubles").map(e => `${e.draw} ${e.type}`),
            tour: entry.tour,
            ...(doublesMainEntry?.status && { doubles_status: doublesMainEntry.status }),
            ...(doublesQualEntry?.q_status && { doubles_q_status: doublesQualEntry.q_status }),
            ...(doublesMainEntry?.seed && { doubles_seed: doublesMainEntry.seed }),
            ...(doublesQualEntry?.q_seed && { doubles_q_seed: doublesQualEntry.q_seed }),
            doubles_withdrawn: doublesMainEntry?.withdrawn || doublesQualEntry?.withdrawn,
            players: [
              {
                id: entry.id,
                first_name: entry.first_name,
                last_name: entry.last_name,
                country: entry.country,
                ...((doublesMainEntry?.rank || doublesQualEntry?.rank) && { doubles_rank: doublesMainEntry?.rank ?? doublesQualEntry?.rank })
              },
              ...(partnerEntry ?
                [
                  {
                    id: partnerEntry.id,
                    first_name: partnerEntry.first_name,
                    last_name: partnerEntry.last_name,
                    country: partnerEntry.country,
                    ...(partnerEntry?.rank && { doubles_rank: partnerEntry.rank })
                  }
                ]
              : [])
            ]
          })
          usedDoublesIds.add(entry.id)
          usedDoublesIds.add(partnerEntry?.id)
        }
      } else {
        if (usedIds.has(entry.id)) continue
        allEntries.push({
          type: sameIdEntries.map(e => `${e.draw} ${e.type}`),
          tour: entry.tour,
          ...(singlesMainEntry?.status && { singles_status: singlesMainEntry.status }),
          ...(singlesQualEntry?.q_status && { singles_q_status: singlesQualEntry.q_status }),
          ...(singlesMainEntry?.seed && { singles_seed: singlesMainEntry.seed }),
          ...(singlesQualEntry?.q_seed && { singles_q_seed: singlesQualEntry.q_seed }),
          ...(doublesMainEntry?.status && { doubles_status: doublesMainEntry.status }),
          ...(doublesQualEntry?.q_status && { doubles_q_status: doublesQualEntry.q_status }),
          ...(doublesMainEntry?.seed && { doubles_seed: doublesMainEntry.seed }),
          ...(doublesQualEntry?.q_seed && { doubles_q_seed: doublesQualEntry.q_seed }),
          singles_withdrawn: singlesMainEntry?.withdrawn || singlesQualEntry?.withdrawn,
          doubles_withdrawn: doublesMainEntry?.withdrawn || doublesQualEntry?.withdrawn,
          players: [
            {
              id: entry.id,
              first_name: entry.first_name,
              last_name: entry.last_name,
              country: entry.country,
              ...((singlesMainEntry?.rank || singlesQualEntry?.rank) && { singles_rank: singlesMainEntry?.rank ?? singlesQualEntry?.rank }),
              ...((doublesMainEntry?.rank || doublesQualEntry?.rank) && { doubles_rank: doublesMainEntry?.rank ?? doublesQualEntry?.rank })
            }
          ]
        })
        usedIds.add(entry.id)
      }
    }

    return allEntries.sort((a, b) => {
      const rankA = Math.min(...a.players.map(p => p.singles_rank ?? p.doubles_rank ?? Infinity)) || Infinity
      const rankB = Math.min(...b.players.map(p => p.singles_rank ?? p.doubles_rank ?? Infinity)) || Infinity
      return rankA - rankB
    })
  }
  return []
})

const formattedEntries = computed(() => {
  return sortedEntries.value.filter(entry => {
    const tourMatch = tour.value.includes(entry.tour)
    const drawMatch = entry.type.some(t => {
      if (drawType.value.includes("Main") && t.includes("Main")) return true
      if (drawType.value.includes("Qualifying") && t.includes("Qualifying")) return true
      return false
    })
    const matchMatch = entry.type.some(t => {
      if (matchType.value.includes("Singles") && t.includes("Singles")) return true
      if (matchType.value.includes("Doubles") && t.includes("Doubles")) return true
      return false
    })
    return tourMatch && drawMatch && matchMatch
  })
})
</script>

<template>
  <dashboard-subpanel
    id="entries"
    title="Entries"
    :icon="icons.player"
  >
    <template #right>
      <u-switch
        v-model="viewType"
        :label="viewType ? 'Team' : 'Individual'"
        :unchecked-icon="icons.noPeople"
        :checked-icon="icons.people"
      />
    </template>

    <div class="w-full flex items-center justify-between mb-5">
      <u-checkbox-group
        v-if="tours.includes('ATP') && tours.includes('WTA')"
        v-model="tour"
        :items="['ATP', 'WTA']"
        orientation="horizontal"
        :icon="icons.upcoming"
      />
      <u-checkbox-group
        v-model="drawType"
        :items="['Main', 'Qualifying']"
        orientation="horizontal"
        :icon="icons.upcoming"
      />
      <u-checkbox-group
        v-model="matchType"
        :items="['Singles', 'Doubles']"
        orientation="horizontal"
        :icon="icons.upcoming"
      />
    </div>

    <ClientOnly>
      <component
        :is="viewMode === 'list' ? EventEntriesTable : EventEntriesGrid"
        :key="viewMode"
        :entries="formattedEntries"
        :status
        :tournament="data?.tournament ?? ''"
        :viewType
      />
    </ClientOnly>
  </dashboard-subpanel>
</template>
