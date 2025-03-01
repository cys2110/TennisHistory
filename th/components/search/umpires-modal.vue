<script setup lang="ts">
const { id } = defineProps<{ id: string }>()

// API call
const { data: matches } = await useFetch<UmpireSearchResultsType[]>("/api/umpireSearch", { query: { id } })
</script>

<template>
  <u-modal
    :title="`Matches umpired by ${id}`"
    description="Umpire"
  >
    <template #body>
      <u-page-list v-if="matches">
        <u-page-card
          v-for="event in matches"
          :key="event.eid"
          :title="`${event.name} ${event.year}`"
          class="my-5"
          highlight
          orientation="vertical"
        >
          <!--FIXME: font sizes-->
          <template #description>
            <div
              v-for="round in event.rounds"
              :key="round.round"
              class="my-4"
            >
              <div class="font-semibold">{{ round.round }}</div>
              <u-page-list class="gap-1">
                <u-page-feature
                  v-for="match in round.matches"
                  :key="match.mid"
                  :description="`${match.p1} v. ${match.p2}`"
                  class="hover-link cursor-pointer"
                  :to="{ name: 'match', params: { name: useChangeCase(event.name, 'kebabCase').value, tid: event.tid, year: event.year, eid: event.eid, mid: match.mid } }"
                />
              </u-page-list>
            </div>
          </template>
          <template #footer>
            <u-button-group size="xs">
              <u-button
                v-for="page in eVENTPAGES"
                :key="page.label"
                :label="page.label"
                color="secondary"
                variant="subtle"
                :to="{ name: page.name, params: { name: useChangeCase(event.name, 'kebabCase').value, tid: event.tid, year: event.year, eid: event.eid } }"
                :icon="page.icon"
                prefetch-on="interaction"
              />
            </u-button-group>
          </template>
        </u-page-card>
      </u-page-list>

      <error-message
        v-else
        :icon="ICONS['no-info']"
        :title="`No matches umpired by ${id}`"
      />
    </template>
  </u-modal>
</template>
