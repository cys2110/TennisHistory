<script setup lang="ts">
definePageMeta({ name: "years" })
const toast = useToast()
const id = useRouteQuery<string>("year", new Date().getFullYear().toString())
useHead({ title: () => id.value, templateParams: { subPage: "Years" } })

interface YearAPIResponse {
  established_tournaments: Pick<TournamentInterface, "id" | "name">[]
  abolished_tournaments: Pick<TournamentInterface, "id" | "name">[]
  pro_players: Pick<PlayerInterface, "id" | "name" | "country">[]
  retired_players: Pick<PlayerInterface, "id" | "name" | "country">[]
  born_players: Pick<PlayerInterface, "id" | "name" | "country">[]
  died_players: Pick<PlayerInterface, "id" | "name" | "country">[]
}

const { data: year, status } = await useFetch<YearAPIResponse>("/api/year-details", {
  query: { id },
  onResponseError: () => {
    toast.add({
      title: `Error fetching year details for ${id.value}`,
      icon: ICONS.error,
      color: "error"
    })
  }
})

// Breadcrumbs
const items = [
  { label: "Home", to: { name: "home" }, icon: ICONS.home },
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
        <u-collapsible v-if="year.established_tournaments">
          <u-button
            class="group my-2"
            label="Tournaments established"
            color="neutral"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
            block
            :trailing-icon="ICONS.chevronDown"
          />
          <template #content>
            <div class="flex flex-col gap-2 max-h-100 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent scrollbar-thumb-rounded-full">
              <tournament-link
                v-if="year.established_tournaments.length > 0"
                v-for="tournament in year.established_tournaments"
                :key="tournament.id"
                :name="tournament.name"
                :id="tournament.id"
                class="text-sm w-fit"
              />
              <span
                v-else
                class="text-sm text-center"
              >
                No tournaments established in {{ id }}
              </span>
            </div>
          </template>
        </u-collapsible>

        <u-collapsible v-if="year.abolished_tournaments">
          <u-button
            class="group my-2"
            label="Tournaments abolished"
            color="neutral"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
            block
            :trailing-icon="ICONS.chevronDown"
          />
          <template #content>
            <div class="flex flex-col gap-2 max-h-100 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent scrollbar-thumb-rounded-full">
              <tournament-link
                v-if="year.abolished_tournaments.length > 0"
                v-for="tournament in year.abolished_tournaments"
                :key="tournament.id"
                :name="tournament.name"
                :id="tournament.id"
                class="text-sm w-fit"
              />
              <span
                v-else
                class="text-sm text-center"
              >
                No tournaments abolished in {{ id }}
              </span>
            </div>
          </template>
        </u-collapsible>

        <u-collapsible v-if="year.pro_players">
          <u-button
            class="group my-2"
            label="Players who turned pro"
            color="neutral"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
            block
            :trailing-icon="ICONS.chevronDown"
          />
          <template #content>
            <div class="flex flex-col gap-2 max-h-100 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent scrollbar-thumb-rounded-full">
              <player-avatar
                v-if="year.pro_players.length > 0"
                v-for="player in year.pro_players"
                :key="player.id"
                :player
              />
              <span
                v-else
                class="text-sm text-center"
              >
                No players who turned pro in {{ id }}
              </span>
            </div>
          </template>
        </u-collapsible>

        <u-collapsible v-if="year.retired_players">
          <u-button
            class="group my-2"
            label="Players who retired"
            color="neutral"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
            block
            :trailing-icon="ICONS.chevronDown"
          />
          <template #content>
            <div class="flex flex-col gap-2 max-h-100 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent scrollbar-thumb-rounded-full">
              <player-avatar
                v-if="year.retired_players.length > 0"
                v-for="player in year.retired_players"
                :key="player.id"
                :player
              />
              <span
                v-else
                class="text-sm text-center"
              >
                No players who retired in {{ id }}
              </span>
            </div>
          </template>
        </u-collapsible>

        <u-collapsible v-if="year.born_players">
          <u-button
            class="group my-2"
            label="Players who were born"
            color="neutral"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
            block
            :trailing-icon="ICONS.chevronDown"
          />
          <template #content>
            <div class="flex flex-col gap-2 max-h-100 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent scrollbar-thumb-rounded-full">
              <player-avatar
                v-if="year.born_players.length > 0"
                v-for="player in year.born_players"
                :key="player.id"
                :player
              />
              <span
                v-else
                class="text-sm text-center"
              >
                No players born in {{ id }}
              </span>
            </div>
          </template>
        </u-collapsible>

        <u-collapsible v-if="year.died_players">
          <u-button
            class="group my-2"
            label="Players who died"
            color="neutral"
            :ui="{ trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
            block
            :trailing-icon="ICONS.chevronDown"
          />
          <template #content>
            <div class="flex flex-col gap-2 max-h-100 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-600 scrollbar-track-transparent scrollbar-thumb-rounded-full">
              <player-avatar
                v-if="year.died_players.length > 0"
                v-for="player in year.died_players"
                :key="player.id"
                :player
              />
              <span
                v-else
                class="text-sm text-center"
              >
                No players who died in {{ id }}
              </span>
            </div>
          </template>
        </u-collapsible>
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
