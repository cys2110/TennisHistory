<script setup lang="ts">
const { event } = defineProps<{ event: APIUmpireEventType }>()
const {
  ui: { icons }
} = useAppConfig()

const ringColour = computed(() => {
  if (event.tours.includes("Men")) {
    return "ring-men dark:ring-men"
  } else if (event.tours.includes("Women")) {
    return "ring-women dark:ring-women"
  } else if (event.tours.length === 2) {
    return "ring-joint dark:ring-joint"
  } else if (event.tours.includes("ATP")) {
    return "ring-atp dark:ring-atp"
  } else {
    return "ring-wta dark:ring-wta"
  }
})

const getMID = (match_no: number, match_type: string[]) => {
  const genderPrefix = match_type.includes("WTA") || match_type.includes("Women") ? "l" : "m"
  const typePrefix = match_type.includes("Singles") ? "s" : "d"
  const drawTypePrefix = match_type.includes("Main") ? "m" : "q"
  const suffix =
    match_no < 10 ? `00${match_no}`
    : match_no < 100 ? `0${match_no}`
    : match_no
  return `${drawTypePrefix}${genderPrefix}${typePrefix}${suffix}`
}
</script>

<template>
  <u-card
    :class="ringColour"
    :ui="{ header: 'flex-row items-center justify-between font-semibold text-base' }"
  >
    <template #header>
      <u-link
        :to="{ name: 'tournament', params: { id: event.tournament.id, name: encodeName(event.tournament.name) } }"
        class="hover-link"
      >
        {{ event.tournament.name }}
      </u-link>
      {{ event.year }}
    </template>

    <u-collapsible
      v-for="round in event.rounds"
      :key="round.round"
    >
      <u-button
        class="group my-2"
        :label="round.round"
        color="neutral"
        :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
        block
        :trailing-icon="icons.chevronDown"
      />
      <template #content>
        <u-link
          v-for="match in round.matches"
          :key="match.match_no"
          :to="{
            name: 'match',
            params: {
              id: event.tournament.id,
              name: encodeName(event.tournament.name),
              year: event.year,
              eid: event.id,
              mid: getMID(match.match_no, match.type)
            }
          }"
        >
          <div class="flex items-center gap-2 text-xs md:text-sm">
            <u-icon
              :name="getFlagCode(match.p1.country as CountryInterface)"
              class="text-xl"
            />
            <span>{{ match.p1.name }}</span>
            v.
            <u-icon
              :name="getFlagCode(match.p2.country as CountryInterface)"
              class="text-xl"
            />
            <span>{{ match.p2.name }}</span>
          </div>
        </u-link>
      </template>
    </u-collapsible>

    <template #footer>
      <event-buttons
        :tournament="event.tournament"
        :year="event.year"
        :id="event.id"
        class="mx-auto"
      />
    </template>
  </u-card>
</template>
