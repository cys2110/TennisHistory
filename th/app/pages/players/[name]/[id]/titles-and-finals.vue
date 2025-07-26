<script setup lang="ts">
import { PlayerTitlesAndFinalsTable, PlayerTitlesAndFinalsTimeline } from "#components"

definePageMeta({ name: "titles-and-finals" })
const { icons } = useAppConfig()
const { viewMode } = useViewMode()
const { tableMode } = useDefaultTable()
const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1280 })
const mdAndDown = breakpoints.smallerOrEqual("md")
const { params } = useRoute()
const { id } = params as { id: string }

const selectedMatchType = ref<MatchType[]>()
const selection = ref<("Titles" | "Finals")[]>([])
const levels = ref<("Tour" | "Challenger" | "ITF")[]>()
const componentKey = ref(0)

const { data, status } = await useFetch<TitlesAndFinalsInterface[]>("/api/players/titles-and-finals", {
  key: `titles-and-finals-${id}`,
  query: { id },
  default: () => []
})

watch(
  [selectedMatchType, selection],
  () => {
    componentKey.value++
  },
  { deep: true }
)

const events = computed(() =>
  data.value
    .filter(event => {
      if (
        (selectedMatchType.value && selectedMatchType.value.length > 0 && !selectedMatchType.value.includes(event.type)) ||
        (selection.value && selection.value.length > 0 && !selection.value.includes(event.titles)) ||
        (levels.value && levels.value.length > 0 && !levels.value.includes(event.level))
      )
        return false
      return true
    })
    .map(event => ({
      ...event,
      icon: event.titles === "Titles" ? icons.one : icons.noTournament
    }))
)
</script>

<template>
  <player-wrapper>
    <template
      #toolbar
      v-if="mdAndDown || tableMode !== 'grouped' || viewMode !== 'list'"
    >
      <u-slideover
        v-if="mdAndDown"
        title="Filters"
        class="ml-auto"
      >
        <u-button
          size="xs"
          :icon="icons.filter"
        />

        <template #body>
          <u-checkbox-group
            v-model="selection"
            :items="['Titles', 'Finals']"
            orientation="horizontal"
          />

          <u-checkbox-group
            v-model="levels"
            :items="['Tour', 'Challenger', 'ITF']"
            orientation="horizontal"
          />

          <filter-checkbox-match-type v-model="selectedMatchType" />
        </template>
      </u-slideover>
      <template v-else-if="tableMode !== 'grouped' || viewMode !== 'list'">
        <u-checkbox-group
          v-model="selection"
          :items="['Titles', 'Finals']"
          orientation="horizontal"
        />

        <u-checkbox-group
          v-model="levels"
          :items="['Tour', 'Challenger', 'ITF']"
          orientation="horizontal"
        />

        <u-checkbox-group
          v-model="selectedMatchType"
          :items="['Singles', 'Doubles']"
          orientation="horizontal"
        />
      </template>
    </template>

    <template #default="{ tour, first_name, last_name }">
      <component
        :is="viewMode === 'list' ? PlayerTitlesAndFinalsTable : PlayerTitlesAndFinalsTimeline"
        :key="`${viewMode} - ${componentKey}`"
        :events
        :status
        :tour
        :first-name="first_name"
        :last-name="last_name"
        :selection
      />
    </template>
  </player-wrapper>
</template>
