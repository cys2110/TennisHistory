<script setup lang="ts">
definePageMeta({ name: "years" })
const id = useRouteQuery<string>("year", new Date().getFullYear().toString())
useHead({ title: () => id.value, templateParams: { subPage: "Years" } })

interface YearAPIResponse {
  established_tournaments: Pick<TournamentInterface, "id" | "name">[]
  abolished_tournaments: Pick<TournamentInterface, "id" | "name">[]
  pro_players: Pick<PlayerInterface, "id" | "name" | "country">[]
  retired_players: Pick<PlayerInterface, "id" | "name" | "country">[]
  born_players: Pick<PlayerInterface, "id" | "name" | "country">[]
  died_players: Pick<PlayerInterface, "id" | "name" | "country">[]
  hof: Pick<PlayerInterface, "id" | "name" | "country">[]
}

const { data: year, status } = await useFetch<YearAPIResponse>("/api/year-details", { query: { id } })

// Breadcrumbs
const items = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
  { label: "Years", icon: ICONS.calendar },
  { label: id.value, icon: ICONS.year }
]
</script>

<template>
  <div>
    <nuxt-layout name="default">
      <template #title>
        <u-breadcrumb :items />
      </template>

      <template #toolbar>
        <years-all-select v-model="id" />
      </template>

      <u-page-grid
        v-if="year"
        class="xl:grid-cols-4 2xl:grid-cols-4"
      >
        <year-tournament-collapsible
          v-if="year.established_tournaments"
          label="established"
          :tournaments="year.established_tournaments"
          :year="id"
        />

        <year-tournament-collapsible
          v-if="year.abolished_tournaments"
          label="abolished"
          :tournaments="year.abolished_tournaments"
          :year="id"
        />

        <year-player-collapsible
          v-if="year.pro_players"
          label="who turned pro"
          :players="year.pro_players"
          :year="id"
        />

        <year-player-collapsible
          v-if="year.retired_players"
          label="who retired"
          :players="year.retired_players"
          :year="id"
        />

        <year-player-collapsible
          v-if="year.born_players"
          label="who were born"
          :players="year.born_players"
          :year="id"
        />

        <year-player-collapsible
          v-if="year.died_players"
          label="who died"
          :players="year.died_players"
          :year="id"
        />

        <year-player-collapsible
          v-if="year.hof"
          label="inducted into the Hall of Fame"
          :players="year.hof"
          :year="id"
        />
      </u-page-grid>

      <error-message
        v-else
        :title="`No details found for ${id}`"
        :icon="ICONS.noCalendar"
        :status="status"
        :error="`Error fetching year details for ${id}`"
      />
    </nuxt-layout>
  </div>
</template>
