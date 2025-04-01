<script setup lang="ts">
definePageMeta({ name: "umpire" })
const toast = useToast()
const id = useRouteParams<string>("id")
const name = computed(() => decodeName(id.value))
useHead({ title: name.value, templateParams: { subPage: "Umpires" } })

interface UmpireAPIResponse {
  name: string
  tid: string
  events: {
    eid: string
    year: string
    draw_type: DrawType
    rounds: {
      round: RoundType
      matches: { mid: string; p1: string; p2: string }[]
    }[]
  }[]
}

// API call
const { data: tournaments, status } = await useFetch<UmpireAPIResponse[]>("/api/umpire-details", {
  query: { id: name },
  onResponseError: () => {
    toast.add({
      title: `Error fetching ${name.value}'s details`,
      icon: ICONS.error,
      color: "error"
    })
  }
})

// Breadcrumbs
const items = computed(() => [{ label: "Home", to: { name: "home" }, icon: ICONS.home }, { label: "Umpires", to: { name: "umpires" }, icon: ICONS.umpire }, { label: name.value }])

// Anchor links
const links = computed(() => {
  if (tournaments.value)
    return tournaments.value.map(tournament => ({
      to: "#tournament-" + tournament.tid,
      label: tournament.name
    }))
})
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items="items" />
      </template>

      <!--TOC-->
      <template #right>
        <u-dropdown-menu :items="links">
          <u-button
            :icon="ICONS.toc"
            color="neutral"
            variant="link"
            size="xl"
          />
        </u-dropdown-menu>
      </template>

      <template #toolbar>
        <div class="text-(--ui-text-muted) text-sm font-semibold">Matches umpired by {{ name }}</div>
      </template>

      <u-page-columns
        class="xl:columns-4 2xl:columns-4"
        v-if="tournaments"
      >
        <u-card
          v-for="tournament in tournaments"
          :key="tournament.tid"
          :id="`tournament-${tournament.tid}`"
        >
          <template #header>
            <tournament-link
              :id="tournament.tid"
              :name="tournament.name"
              class="text-lg font-semibold !w-fit"
            />
          </template>
          <dashboard-subpanel
            v-for="event in tournament.events"
            :key="event.eid"
            :title="event.year"
          >
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
                :trailing-icon="ICONS.chevronDown"
              />
              <template #content>
                <u-link
                  v-for="match in round.matches"
                  class="flex justify-between items-center text-sm hover-link w-fit"
                  :to="{ name: 'match', params: { name: encodeName(tournament.name), id: tournament.tid, eid: event.eid, year: event.year, mid: match.mid } }"
                >
                  {{ match.p1 }} v. {{ match.p2 }}
                </u-link>
              </template>
            </u-collapsible>
            <div class="mx-auto mt-5">
              <event-buttons
                :name="tournament.name"
                :tid="tournament.tid"
                :year="event.year"
                :eid="event.eid"
                :draw-type="event.draw_type"
              />
            </div>
          </dashboard-subpanel>
        </u-card>
      </u-page-columns>

      <error-message
        v-else
        :icon="ICONS.noPlayer"
        :title="`No details found for ${name}`"
        :status
      />
    </nuxt-layout>
  </div>
</template>
